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

// router.get('/db', async (req, res) => {
//     try {
//         const client = await pool.connect();
//         const result = await client.query('SELECT * FROM test_table');
//         const results = { 'results': (result) ? result.rows : null };
//         res.render('pages/db', results);
//         client.release();
//     } catch (err) {
//         console.error(err);
//         res.send("Error " + err);
//     }
// })

module.exports = router