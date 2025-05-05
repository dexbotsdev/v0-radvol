import { Sequelize } from "sequelize"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

// Database path
const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "..", "data", "trading-bot.sqlite")

// Create Sequelize instance
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
})

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")
    return true
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    return false
  }
}
