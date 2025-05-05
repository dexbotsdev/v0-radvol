import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"

export interface ConfigAttributes {
  id?: number
  mainWalletKey: string
  fundingWalletKey: string
  createdAt?: Date
  updatedAt?: Date
}

export class Config extends Model<ConfigAttributes> implements ConfigAttributes {
  public id!: number
  public mainWalletKey!: string
  public fundingWalletKey!: string

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Config.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mainWalletKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fundingWalletKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "configs",
    timestamps: true,
  },
)
