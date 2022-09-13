const express = require("express")
const router = express.Router()
const { Edition } = require("../models")

router.get("/", async (req, res) => {
    let editions
    try {
        editions = await Edition.findAll()
    } catch (err) {
        console.log(err)
        editions = []
    }
    res.render("index", { editions: editions })
})



module.exports = router