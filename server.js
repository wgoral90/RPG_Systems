if (process.env.NODE_ENV !== "production") {
    require('dotenv').parse()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const PORT = 4000
const Pool = require("pg").Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const indexRouter = require("./routes/index")
const dbRouter = require("./routes/index")

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))
app.use("/", indexRouter)
app.use("/db", dbRouter)



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})