if (process.env.NODE_ENV !== "production") {
    require('dotenv').load()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const db = require("./models")
const PORT = 4000

const morgan = require('morgan')

// const Pool = require("pg").Pool
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

const indexRouter = require("./routes/index")
const systemsRouter = require("./routes/systems")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }))
app.use(morgan("dev"))
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))
app.use("/", indexRouter)
app.use("/systems", systemsRouter)

db.sequelize.sync().then((req => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}))