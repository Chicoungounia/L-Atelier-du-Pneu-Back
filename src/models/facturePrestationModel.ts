import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Prestation from "./prestationModels";
import Facture from "./factureModels";

class FacturePrestation extends Model {
  public id!: number;
  public factureId!: number;
  public prestationId!: number;
  public prix_htva!: number;
  public quantite!: number;
  public remise!: number;
  public total_htva!: number;
  public tva!: number;
  public total_ttc!: number;
}

FacturePrestation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    factureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Facture,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    prestationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Prestation,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    prix_htva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    remise: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_htva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_ttc: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "facture_prestations",
    timestamps: false,
  }
);



export default FacturePrestation;
