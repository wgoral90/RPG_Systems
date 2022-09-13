const express = require("express")
const { read } = require("fs")
const router = express.Router()
const { System } = require("../models/")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//All System Routes
router.get("/", async (req, res) => {
    let searchOptions = {}
    if (req.query.name && req.query.name !== "") {
        searchOptions.name = req.query.name
        console.log(searchOptions.name)
        try {
            const systems = await System.findAll({ where: { name: { [Op.like]: `%${searchOptions.name}%` } } })
            console.log(systems)
            res.render("systems/index", { systems: systems, searchOptions: req.query })
        } catch {
            res.redirect("/")
        }
    } else {
        try {
            const systems = await System.findAll()
            res.render("systems/index", { systems: systems })
        } catch {
            res.redirect("/")
        }
    }
})

// New System
router.get("/new", (req, res) => {
    res.render("systems/new", { system: new System() })
})

// Create System
router.post("/", async (req, res) => {
    const system = new System({
        name: req.body.name
    })

    try {
        await System.create({
            name: system.name
        })
        res.redirect("systems")
    } catch (err) {
        res.render("systems/new", {
            system: system,
            errorMessage: "Error creating System",
        })
    }

})

module.exports = router
