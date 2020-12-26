const {Router} = require('express')
const Advertisement = require('../models/Advertisement')
const auth = require("../middleware/auth.middelware")
const router = Router()

router.post("/", auth, async (req, res) => {
    try {
        await Advertisement.create({userId: req.user.id, type: req.body.type}).then(advertisement => {
            if (!advertisement) {
                return res.status(400).json({message: "Something go wrong, try again"})
            }
        })
        res.json({message: "Advertisement has been created"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get("/nannies", async (req, res) => {
    try {
        await Advertisement.findAll({where: {type: "nanny"}, raw: true}).then(nannies => {
            if (!nannies) {
                return res.status(400).json({message: "There is no advertisements"})
            }
            res.json({nannies})
        })
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get("/parents", async (req, res) => {
    try {
        await Advertisement.findAll({where: {type: "parent"}, raw: true}).then(parents => {
            if (!parents) {
                return res.status(400).json({message: "There is no advertisements"})
            }
            res.json({parents})
        })
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/:id', async (req, res) => {
    try {
        await Advertisement.findOne({where: {userId: req.params.id}, raw: true}).then(advertisement => {
            if (!advertisement) {
                return res.json({message: "This user don`t have advertisement"})
            }
            res.json({responds: advertisement.responds})
        })
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Advertisement.destroy({where: {userId: req.params.id}})
        res.json({message: "Advertisement deleted successfully"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.put('/respond/:id', auth, async  (req, res) => {
    await Advertisement.findOne({where: {userId: req.params.id}, raw: true}).then(async advertisement => {
        if (!advertisement) {
            return res.status(400).json({message: "This user don`t have advertisement"})
        }

        if (!advertisement.responds) advertisement.responds = []

        if (!advertisement.responds.includes(req.user.id)) {
            advertisement.responds.unshift(req.user.id)
            await Advertisement.update({responds: advertisement.responds}, {where: {userId: req.params.id}})
            return res.json({message: "Ваше зацікавлення вдало зафіксовано!"})
        }
        else {
            return res.json({message: "Ваше зацікавлення вже зафіксоване!"})
        }
    })
})

module.exports = router