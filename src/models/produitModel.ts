import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ProduitAttributes {
  id?: number;
  saison: "été" | "hiver" | "4 saisons";
  marque: "Michelin" | "Bridgestone" | "Hankook" | "Goodyear";
  modele: string;
  Largeur_pneu: 185 | 190 | 195 | 200 | 205 | 210 | 215 | 220 | 225 | 230 | 235;
  profil_pneu: 45 | 50 | 55 | 60 | 65;
  type_pneu: "R" | "D";
  diametre: 15 | 16 | 17 | 18 | 19 | 20;
  indice_charge: number; // Entre 85 et 130
  indice_vitesse: "H" | "T" | "V";
  renfort: "XL" | "C" | "LT" | "RF" | "RS";
  stock: number;
  prix: number;
  image: string;}

class Produit extends Model<ProduitAttributes> implements ProduitAttributes {
  public id!: number;
  public saison!: "été" | "hiver" | "4 saisons";
  public marque!: "Michelin" | "Bridgestone" | "Hankook" | "Goodyear";
  public modele!: string;
  public Largeur_pneu!: 185 | 190 | 195 | 200 | 205 | 210 | 215 | 220 | 225 | 230 | 235;
  public profil_pneu!: 45 | 50 | 55 | 60 | 65;
  public type_pneu!: "R" | "D";
  public diametre!: 15 | 16 | 17 | 18 | 19 | 20;
  public indice_charge!: number;
  public indice_vitesse!: "H" | "T" | "V";
  public renfort!: "XL" | "C" | "LT" | "RF" | "RS";
  public stock!: number;
  public prix!: number;
  public image!: string;
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
        validate: {
          isIn: [["été", "hiver", "4 saisons"]],
        },
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
        validate: {
          isIn: [[185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235]],
        },
      },
      profil_pneu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[45, 50, 55, 60, 65]],
        },
      },
      type_pneu: {
        type: DataTypes.ENUM("R", "D"),
        allowNull: false,
      },
      diametre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[15, 16, 17, 18, 19, 20]],
        },
      },
      indice_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 85,
          max: 130,
        },
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
        type: DataTypes.STRING, // Ajout de la colonne image
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "produits",
      timestamps: true,
    }
  );

export default Produit;
