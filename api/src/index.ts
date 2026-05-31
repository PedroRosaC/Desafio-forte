import express from "express"
import cors from "cors"
import bookRoutes from "./routes/bookRoutes"
import loanRoutes from "./routes/loanRoutes"
import { initDb } from "./db"

const API_PORT = 8080

const api = express()

api.use(express.json())

api.use(cors({
    origin: "*",
}))

api.get("/", (request, response) => {
    response.send("API is up")
})

api.use("/books", bookRoutes)
api.use("/loans", loanRoutes)

initDb().then(() => {
    api.listen(API_PORT, "0.0.0.0", () => {
        console.log(`API running on port ${API_PORT}`)
    })
})