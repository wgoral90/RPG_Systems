const express = require("express")
const { read } = require("fs")
const router = express.Router()
const { Edition } = require("../models")
const { System } = require("../models")
const Sequelize = require('sequelize');
const path = require("path")
const coverImageBasePath = "uploads/bookCovers"
const uploadPath = path.join("public", Edition.coverImageBasePath)
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"]
const Op = Sequelize.Op;
const multer = require("multer")
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


//All Edition Routes
router.get("/", async (req, res) => {
    res.send("All Editions")
})

// New Edition
router.get("/new", async (req, res) => {
    renderNewPage(res, new Edition())
})


// Create Edition
router.post("/", upload.single("image"), async (req, res) => {
    const fileName = req.file != null ? req.file.file : null
    const edition = {
        title: req.body.title,
        system: req.body.system,
        version: req.body.version,
        description: req.body.description,
        coverImageName: fileName,
        systemId: req.body.system
    }

    try {
        await Edition.create({
            title: edition.title,
            SystemId: edition.system,
            version: edition.version,
            description: edition.descrpition,
            coverImageName: fileName
        })
        res.redirect("editions")
    } catch (err) {
        console.log(err)
        renderNewPage(res, edition, true)
    }



})

async function renderNewPage(res, edition, hasError = false) {
    try {
        const systems = await System.findAll()
        const params = {
            systems: systems,
            edition: edition
        }
        if (hasError) params.errorMessage = "Error Creating Edition"
        res.render("editions/new", params)
    } catch (err) {
        console.log(err)
        res.redirect("")
    }
}

module.exports = router
