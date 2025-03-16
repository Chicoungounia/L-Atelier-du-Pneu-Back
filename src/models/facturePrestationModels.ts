import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Facture from "./factureModels";
import Prestation from "./prestationModels";

class FacturePrestations extends Model {
  public factureId!: number;
  public prestationId!: number;
  public quantite!: number;
  public prix_htva!: number;
  public remise!: number;
  public tva!: number;
  public total_ttc!: number;
}

FacturePrestations.init(
  {
    factureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Facture,
        key: "id",
      },
    },
    prestationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Prestation,
        key: "id",
      },
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Défaut à 1 si non précisé
    },
    prix_htva: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    remise: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tva: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total_ttc: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "facture_prestations",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Association Many-to-Many
Facture.belongsToMany(Prestation, { through: FacturePrestations, foreignKey: "factureId" });
Prestation.belongsToMany(Facture, { through: FacturePrestations, foreignKey: "prestationId" });

export default FacturePrestations;
