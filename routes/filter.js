const {Router} = require('express')
const { Op } = require("sequelize");
const Nanny = require("../models/Nanny")
const Parent = require("../models/Parent")
const Advertisement = require("../models/Advertisement")
const router = Router()

router.get('/nanny', async (req, res) => {
    try {
        const nannies = await Advertisement.findAll({raw: true, where: {type: "nanny"}})
        let cities = []
        for (const nanny of nannies) {
            let result = await Nanny.findOne({raw: true, where: {userId: nanny.userId}})
            cities.unshift(result.city)
        }
        res.json({cities})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again", err: err.message})
    }
})

router.get('/parent', async (req, res) => {
    try {
        const parents = await Advertisement.findAll({raw: true, where: {type: "parent"}})
        let cities = []
        for (const parent of parents) {
            let result = await Parent.findOne({raw: true, where: {userId: parent.userId}})
            cities.unshift(result.city)
        }
        res.json({cities})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again", err: err.message})
    }
})

router.post('/nanny', async (req, res)=> {
    try {
        const {age, salaryFrom, salaryTo, city} = req.body
        let whereCommand = {}

        // age: <20 (1); 20-25 (2); 26-30 (3); >30 (4)

        if(age){
            switch (age){
                case "1":
                    whereCommand.age = {[Op.lt]: 20}
                    break
                case "2":
                    whereCommand.age = {[Op.gte]: 20, [Op.lte]: 25}
                    break
                case "3":
                    whereCommand.age = {[Op.gte]: 26, [Op.lte]: 30}
                    break
                case "4":
                    whereCommand.age = {[Op.gt]: 30}
                    break
            }
        }

        if (city) {
            whereCommand.city = city
        }

        if (salaryFrom || salaryTo) {
            if (salaryFrom && salaryTo) {
                whereCommand.salary = {[Op.gte]: salaryFrom, [Op.lte]: salaryTo}
            } else {
                if (salaryFrom) {
                    whereCommand.salary = {[Op.gte]: salaryFrom}
                }
                if (salaryTo) {
                    whereCommand.salary = {[Op.lte]: salaryTo}
                }
            }
        }


        await Nanny.findAll({where: whereCommand}).then(async sortedNannies => {
            let nannies = []
            for (const nanny of sortedNannies) {
                let result = await Advertisement.findOne({raw: true,
                    where: {userId: nanny.userId, type: "nanny"}})
                if (result) {
                    nannies.push(nanny)
                }
            }
            res.json({nannies})
        })
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again", err: err.message})
    }
})

router.post('/parent', async (req, res)=> {
    try {
        const {age, salaryFrom, salaryTo, city} = req.body
        let whereCommand = {}

        // age: <1 (1); 1-3 (2); 4-5 (3); >5 (4)

        if(age){
            switch (age){
                case "1":
                    whereCommand.childAge = {[Op.lt]: 1}
                    break
                case "2":
                    whereCommand.childAge = {[Op.gte]: 1, [Op.lte]: 3}
                    break
                case "3":
                    whereCommand.childAge = {[Op.gte]: 4, [Op.lte]: 5}
                    break
                case "4":
                    whereCommand.childAge = {[Op.gt]: 5}
                    break
            }
        }

        if (city) {
            whereCommand.city = city
        }

        if (salaryFrom || salaryTo) {
            if (salaryFrom && salaryTo) {
                whereCommand.salary = {[Op.gte]: salaryFrom, [Op.lte]: salaryTo}
            } else {
                if (salaryFrom) {
                    whereCommand.salary = {[Op.gte]: salaryFrom}
                }
                if (salaryTo) {
                    whereCommand.salary = {[Op.lte]: salaryTo}
                }
            }
        }

        await Parent.findAll({where: whereCommand}).then(async sortedParents => {
            let parents = []
            for (const parent of sortedParents) {
                let result = await Advertisement.findOne({raw: true,
                    where: {userId: parent.userId, type: "parent"}})
                if (result) {
                    parents.push(parent)
                }
            }
            res.json({parents})
        })

    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again", err: err.message})
    }
})

module.exports = router