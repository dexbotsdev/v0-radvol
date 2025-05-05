import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"

export interface WalletAttributes {
  id?: string
  publicKey: string
  privateKey: string
  balance: string
  selected: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class Wallet extends Model<WalletAttributes> implements WalletAttributes {
  public id!: string
  public publicKey!: string
  public privateKey!: string
  public balance!: string
  public selected!: boolean

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    privateKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    selected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "wallets",
    timestamps: true,
  },
)
