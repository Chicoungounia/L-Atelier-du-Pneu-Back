import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Produit extends Model {
  public id!: number;
  public saison!: "été" | "hiver" | "4 saisons";
  public marque!: "Michelin" | "Bridgestone" | "Hankook" | "Goodyear";
  public modele!: string;
  public Largeur_pneu!: number;
  public profil_pneu!: number;
  public type_pneu!: "R" | "D";
  public diametre!: number;
  public indice_charge!: number;
  public indice_vitesse!: "H" | "T" | "V";
  public renfort!: "XL" | "C" | "LT" | "RF" | "RS";
  public stock!: number;
  public prix!: number;
  public image!: string | null;
}

Produit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saison: {
      type: DataTypes.ENUM("été", "hiver", "4 saisons"),
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
    Largeur_pneu: {
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
      type: DataTypes.ENUM("H", "T", "V"),
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
      allowNull: true, // Permet aux produits de ne pas forcément avoir une image
    },
  },
  {
    sequelize,
    tableName: "produits",
    timestamps: true,
  }
);

export default Produit;
