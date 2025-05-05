import dotenv from "dotenv"

dotenv.config()

export default {
  port: process.env.PORT || 3001,
  dbPath: process.env.DB_PATH || "./data/trading-bot.sqlite",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
}
