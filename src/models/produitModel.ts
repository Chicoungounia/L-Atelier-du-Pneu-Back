import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Définition des attributs sans `id`, `createdAt`, `updatedAt` (Sequelize les gère)
interface ProduitAttributes {
  id?: number;
  saison: "été" | "hiver" | "4_saisons";
  marque: "Michelin" | "Bridgestone" | "Hankook" | "Goodyear";
  modele: string;
  largeur_pneu: number;
  profil_pneu: number;
  type_pneu: "R" | "D";
  diametre: number;
  indice_charge: number;
  indice_vitesse: "H" | "T" | "V" | "W" | "Y";
  renfort: "XL" | "C" | "LT" | "RF" | "RS";
  stock: number;
  prix: number;
  image: string | null;
  status: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}





export class Produit extends Model<ProduitAttributes> implements ProduitAttributes {
  public id!: number;
  public saison!: "été" | "hiver" | "4_saisons";
  public marque!: "Michelin" | "Bridgestone" | "Hankook" | "Goodyear";
  public modele!: string;
  public largeur_pneu!: number;
  public profil_pneu!: number;
  public type_pneu!: "R" | "D";
  public diametre!: number;
  public indice_charge!: number;
  public indice_vitesse!: "H" | "T" | "V" | "W" | "Y";
  public renfort!: "XL" | "C" | "LT" | "RF" | "RS";
  public stock!: number;
  public prix!: number;
  public image!: string | null;
  public status!: Boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Produit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saison: {
      type: DataTypes.ENUM("été", "hiver", "4_saisons"),
      allowNull: false,
    },
    marque: {
      type: DataTypes.ENUM("Michelin", "Bridgestone", "Hankook", "Goodyear"),
      allowNull: false,
    },
    modele: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    largeur_pneu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profil_pneu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_pneu: {
      type: DataTypes.ENUM("R", "D"),
      allowNull: false,
    },
    diametre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    indice_charge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    indice_vitesse: {
      type: DataTypes.ENUM("H", "T", "V", "W", "Y"),
      allowNull: false,
    },
    renfort: {
      type: DataTypes.ENUM("XL", "C", "LT", "RF", "RS"),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
  },
  {
    sequelize,
    tableName: "produits",
    timestamps: true, // Active automatiquement createdAt et updatedAt
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Produit;
