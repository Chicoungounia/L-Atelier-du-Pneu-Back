import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ClientAttributes {
  id?: number;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  telephone: string;
  status: "privé" | "professionnel"; 
  createdAt?: Date;
  updatedAt?: Date;
}

class Client extends Model<ClientAttributes> implements ClientAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public adresse!: string;
  public email!: string;
  public telephone!: string;
  public status!: "privé" | "professionnel"; 
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
    adresse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validation email
      },
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("privé", "professionnel"),
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
