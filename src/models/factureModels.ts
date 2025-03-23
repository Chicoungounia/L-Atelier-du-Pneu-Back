import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./userModels";
import Client from "./clientModel";
import RendezVous from "./rendezVousModel";
import FactureProduit from "./factureProduitModel";
import FacturePrestation from "./facturePrestationModel";


interface FactureAttributes {
  id?: number;
  type: "Devis" | "Facture";
  rendezVousId?: number | null;
  userId?: number | null;
  clientId: number;
  total_htva: number;
  total_remise?: number | null;
  total_tva: number;
  total: number;
  status_payement: "Payer" | "A payer";
  mode_payement: "Virement" | "Carte bancaire" | "Espèces" | "Chèque";
  createdAt?: Date;
  updatedAt?: Date;
}

interface FactureCreationAttributes extends Optional<FactureAttributes, "id"> {}

class Facture extends Model<FactureAttributes, FactureCreationAttributes> implements FactureAttributes {
  public id!: number;
  public type!: "Devis" | "Facture";
  public rendezVousId!: number | null;
  public userId!: number | null;
  public clientId!: number;
  public total_htva!: number;
  public total_remise!: number | null;
  public total_tva!: number;
  public total!: number;
  public status_payement!: "Payer" | "A payer";
  public mode_payement!: "Virement" | "Carte bancaire" | "Espèces" | "Chèque";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Facture.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("Devis", "Facture"),
      allowNull: false,
    },
    rendezVousId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: RendezVous,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    total_htva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_remise: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_tva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status_payement: {
      type: DataTypes.ENUM("Payer", "A payer"),
      allowNull: false,
      defaultValue: "A payer",
    },
    mode_payement: {
      type: DataTypes.ENUM("Virement", "Carte bancaire", "Espèces", "Chèque"),
      allowNull: false,
      defaultValue: "Carte bancaire",
    },
  },
  {
    sequelize,
    tableName: "factures",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Facture.belongsTo(RendezVous, { foreignKey: "rendezVousId" });
Facture.belongsTo(User, { foreignKey: "userId" });
Facture.belongsTo(Client, { foreignKey: "clientId" });
Facture.hasMany(FactureProduit, { foreignKey: "factureId", onDelete: "CASCADE" });
Facture.hasMany(FacturePrestation, { foreignKey: "factureId", onDelete: "CASCADE" });

export default Facture;