import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Client from "./clientModel";
import { User } from "./userModels";

interface RendezVousAttributes {
  id?: number;
  clientId: number;
  ouvrierId: number;
  dateHeure: Date;
  heureFin: Date;
  status?: string;
  updatedAt?: Date;
}

class RendezVous extends Model<RendezVousAttributes> implements RendezVousAttributes {
  public id!: number;
  public clientId!: number;
  public ouvrierId!: number;
  public dateHeure!: Date;
  public heureFin!: Date;
  public status!: string;
}

RendezVous.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
    ouvrierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    dateHeure: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    heureFin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Actif",
    },
  },
  {
    sequelize,
    tableName: "rendezvous",
    timestamps: true,
  }
);

// Définition des relations
Client.hasMany(RendezVous, { foreignKey: "clientId" });
User.hasMany(RendezVous, { foreignKey: "ouvrierId" });
RendezVous.belongsTo(Client, { foreignKey: "clientId" });
RendezVous.belongsTo(User, { foreignKey: "ouvrierId" });

export default RendezVous;
