// models/Commande.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Client from "./clientModel";
import Produit from "./produitModel";

interface CommandeAttributes {
  id?: number;
  client_id: number;
  produit_id: number;
  quantite: number;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Commande extends Model<CommandeAttributes> implements CommandeAttributes {
  public id!: number;
  public client_id!: number;
  public produit_id!: number;
  public quantite!: number;
  public status!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Commande.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
    produit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produit,
        key: "id",
      },
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "commandes",
    timestamps: true,
  }
);


Client.hasMany(Commande, { foreignKey: "client_id", onDelete: "CASCADE" });
Produit.hasMany(Commande, { foreignKey: "produit_id", onDelete: "CASCADE" });
Commande.belongsTo(Client, { foreignKey: "client_id" });
Commande.belongsTo(Produit, { foreignKey: "produit_id" });

export default Commande;
