import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ClientAttributes {
  id?: number;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  telephone: string;
  type: "Privé" | "Professionnel";
  status?: 'Actif' | 'Inactif'; // Ajout du statut actif/inactif 
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
  public type!: "Privé" | "Professionnel"; 
  public status!: 'Actif' | 'Inactif'; // Ajout du statut actif/inactif
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
        isEmail: true,
      },
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Privé", "Professionnel"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Actif", "Inactif"),
      allowNull: false,
      defaultValue: "Actif", // ✅ Valeur par défaut définie ici
    },
  },
  {
    sequelize,
    tableName: "clients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


export default Client;
