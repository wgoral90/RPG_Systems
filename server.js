// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').load()
// }

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const db = require("./models")
const PORT = 4000

const morgan = require('morgan')



const indexRouter = require("./routes/index")
const systemsRouter = require("./routes/systems")
const editionsRouter = require("./routes/editions")
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
app.use("/editions", editionsRouter)

db.sequelize.sync().then((req => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}))