import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./userModels";
import Client from "./clientModel";
import Produit from "./produitModel";
import Prestation from "./prestationModels";
import RendezVous from "./rendezVousModel";

interface FactureAttributes {
  id?: number;
  type: "Devis" | "Facture";
  rendezVousId?: number | null;
  userId?: number | null;
  clientId: number;
  produitId?: number | null;
  prestationId?: number | null;
  prix_htva_produit?: number | null;
  quantite_produit?: number | null;
  remise_produit?: number | null;
  total_htva_produit?: number | null;
  tva_produit?: number | null;
  total_ttc_produit?: number | null;
  prix_htva_prestation?: number | null;
  quantite_prestation?: number | null;
  remise_prestation?: number | null;
  total_htva_prestation?: number | null;
  tva_prestation?: number | null;
  total_ttc_prestation?: number | null;
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
  public produitId!: number | null;
  public prestationId!: number | null;
  public prix_htva_produit!: number | null;
  public quantite_produit!: number | null;
  public remise_produit!: number | null;
  public total_htva_produit!: number | null;
  public tva_produit!: number | null;
  public total_ttc_produit!: number | null;
  public prix_htva_prestation!: number | null;
  public quantite_prestation!: number | null;
  public remise_prestation!: number | null;
  public total_htva_prestation!: number | null;
  public tva_prestation!: number | null;
  public total_ttc_prestation!: number | null;
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
        model: "rendezvous", 
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
    produitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Produit,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    prestationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Prestation,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    prix_htva_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    quantite_produit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    remise_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_htva_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    tva_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_ttc_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    prix_htva_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    quantite_prestation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    remise_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_htva_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    tva_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_ttc_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
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
      allowNull: true,
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
Facture.belongsTo(Produit, { foreignKey: "produitId" });
Facture.belongsTo(Prestation, { foreignKey: "prestationId" });

export default Facture;