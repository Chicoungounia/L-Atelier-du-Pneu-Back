import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./userModels";
import Client from "./clientModel";
import Produit from "./produitModel";
import Prestation from "./prestationModels";

// Définition des attributs de la facture
interface FactureAttributes {
  id?: number;
  type: "Devis" | "Facture";
  userId: number;
  clientId: number;
  produitId: number;
  prestationId: number;
  prix_htva_produit: number;
  quantite_produit: number;
  remise_produit: number;
  tva_produit: number;
  total_ttc_produit: number;
  prix_htva_prestation: number;
  quantite_prestation: number;
  remise_prestation: number;
  tva_prestation: number;
  total_ttc_prestation: number;
  total_htva: number;
  total_remise: number;
  total_tva: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Définition des attributs requis pour la création d'une facture
interface FactureCreationAttributes extends Optional<FactureAttributes, "id"> {}

// Modèle de Facture
class Facture
  extends Model<FactureAttributes, FactureCreationAttributes>
  implements FactureAttributes
{
  public id!: number;
  public type!: "Devis" | "Facture";
  public userId!: number;
  public clientId!: number;
  public produitId!: number;
  public prestationId!: number;
  public prix_htva_produit!: number;
  public quantite_produit!: number;
  public remise_produit!: number;
  public tva_produit!: number;
  public total_ttc_produit!: number;
  public prix_htva_prestation!: number;
  public quantite_prestation!: number;
  public remise_prestation!: number;
  public tva_prestation!: number;
  public total_ttc_prestation!: number;
  public total_htva!: number;
  public total_remise!: number;
  public total_tva!: number;
  public total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialisation du modèle Facture
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    produitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produit,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    prestationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Prestation,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    prix_htva_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    quantite_produit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    remise_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tva_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_ttc_produit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    prix_htva_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    quantite_prestation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    remise_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tva_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_ttc_prestation: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_htva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_remise: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: "factures",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Définition des associations
Facture.belongsTo(User, { foreignKey: "userId" });
Facture.belongsTo(Client, { foreignKey: "clientId" });
Facture.belongsTo(Produit, { foreignKey: "produitId" });
Facture.belongsTo(Prestation, { foreignKey: "prestationId" });

// Mise à jour du stock après validation d'une facture
Facture.afterCreate(async (facture, options) => {
  if (facture.type === "Facture") {
    const produit = await Produit.findByPk(facture.produitId);
    if (produit) {
      produit.stock -= facture.quantite_produit;
      await produit.save({ transaction: options.transaction });
    }
  }
});

export default Facture;
