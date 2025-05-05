import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"

export interface RPCSettingsAttributes {
  id?: number
  rpcUrl: string
  privateKey: string
  createdAt?: Date
  updatedAt?: Date
}

export class RPCSettings extends Model<RPCSettingsAttributes> implements RPCSettingsAttributes {
  public id!: number
  public rpcUrl!: string
  public privateKey!: string

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

RPCSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rpcUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://api.mainnet-beta.solana.com",
    },
    privateKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "rpc_settings",
    timestamps: true,
  },
)
