const {Router} = require('express')
const router = Router()
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')


router.post('/registration',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimum length of password is 5 symbols').isLength({min: 5}),
        check('type', "Choose type").notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.json({
                    message: "Invalid register data",
                    err: errors.array()
                })
            }

            const {email, password, type} = req.body

            //const user = await User.findOne({email})

            if (await User.findOne({where: {email: email}})){
                res.json({message: "User already exists"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            await User.create({email, password: hashedPassword, type}).then(result => {
                const token = jwt.sign(
                    {id: result.id},
                    config.get("jwtKey"),
                    {expiresIn: "96h"}
                )
                res.status(201).json({token: token, userId: result.id, type: type})
            })
        }catch (err) {
            res.json({message: "Something go wrong, try again"})
        }
})

router.post('/login',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Incorrect password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.json({
                    message: "Invalid login data",
                    err: errors.array()
                })
            }

            const {email, password} = req.body
            const user = await User.findOne({raw: true, where: {email: email}})
            if (!user) {
                res.json({message: "Something go wrong, try again"})
            }

            const isCorrectPassword = await bcrypt.compare(password, user.password)
            if (!isCorrectPassword){
                res.json({message: "Something go wrong, try again"})
            }

            const token = jwt.sign(
                {id: user.id},
                config.get('jwtKey'),
                {expiresIn: "96h"}
            )

            res.status(201).json({token, userId: user.id, type: user.type})
        }catch (err) {
            res.json({message: "Something go wrong, try again", err: err.message})
        }
    })

module.exports = router