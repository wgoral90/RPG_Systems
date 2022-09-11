const express = require("express")
const { read, fstat } = require("fs")
const fs = require("fs")
const router = express.Router()
const { Edition } = require("../models")
const { System } = require("../models")
const Sequelize = require('sequelize');
const path = require("path")
const coverImageBasePath = "uploads/bookCovers"
const uploadPath = path.join("public", coverImageBasePath)
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
const Op = Sequelize.Op;
const multer = require("multer")
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/uploads/editionCovers")
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage: storage }).single("image")
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }

})




//All Edition Routes
router.get("/", async (req, res) => {
    let searchOptions = {
        title: req.query.title,
        version: req.query.version,
        system: req.query.system
    }
    const query = hasSearchParams(searchOptions.title, searchOptions.version, searchOptions.system)
    console.log(query)
    if (query.flag) {
        try {
            const editions = await Edition.findAll({ where: query.where })
            res.render("editions/index", { editions: editions })
        }
        catch (err) {
            console.log(err)
            res.redirect("/")
        }
    } else {
        try {
            const editions = await Edition.findAll()
            res.render("editions/index", { editions: editions })
        } catch (err) {
            console.log(err)
            res.redirect("/")
        }
    }
})

// New Edition
router.get("/new", async (req, res) => {
    renderNewPage(res, new Edition())
})


// Create Edition
router.post("/", upload.single("image"), async (req, res) => {
    const fileName = req.file != null ? req.file.file : null
    const fileExtension = path.extname(req.file.originalname)
    console.log(`original name ${req.file.originalname}`)
    console.log(`file ext ${fileExtension}`)
    const edition = {
        title: req.body.title,
        system: req.body.system,
        version: req.body.version,
        description: req.body.description,
        coverImageName: `${req.file.filename}${fileExtension}`,
        systemId: req.body.system
    }
    try {
        await Edition.create({
            title: edition.title,
            SystemId: edition.system,
            version: edition.version,
            description: edition.descrpition,
            coverImageName: edition.coverImageName
        })
        res.redirect("editions")
    } catch (err) {
        console.log(err)
        if (edition.coverImageName !== null) {
            removeCoverImage(edition.coverImageName)
        }

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
function removeCoverImage(filename) {
    fs.unlink(path.join(uploadPath, filename), err => {
        if (err) {
            console.error(err)
        }
    })
}

function hasSearchParams(sTitle, sVersion, sSystem) {
    let query = {
        flag: false,
        where: {}
    }
    console.log(sTitle)
    if (sTitle && sTitle !== null) {
        query.where.title = { [Op.like]: `%${sTitle}%` }
        query.flag = true
    }
    if (sVersion && sVersion !== null) {
        query.where.version = sVersion
        query.flag = true
    }
    if (sSystem && sSystem !== null) {
        query.where.SystemId = sSystem
        query.flag = true
    }

    return query
}
module.exports = router
