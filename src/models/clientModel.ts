import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ClientAttributes {
  id?: number;
  nom: string;
  prenom: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Client extends Model<ClientAttributes> implements ClientAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}    

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "clients",
    timestamps: true,
  }
);

export default Client;
