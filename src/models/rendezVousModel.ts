import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Client from "./clientModel";
import { User } from "./userModels"; 
import Facture from "./factureModels";

interface RendezVousAttributes {
  id?: number;
  clientId: number;
  userId: number;
  pont: 1 | 2 | 3; 
  dateDebut: Date;
  dateFin: Date;
  status: "Réserver" | "Annuler" | "Effectuer";
  timeZone: string;  // Nouvelle propriété pour le fuseau horaire
  createdAt?: Date;
  updatedAt?: Date;
}

class RendezVous extends Model<RendezVousAttributes> implements RendezVousAttributes {
  public id!: number;
  public clientId!: number;
  public userId!: number; 
  public pont!: 1 | 2 | 3; 
  public dateDebut!: Date;
  public dateFin!: Date;
  public status!: "Réserver" | "Annuler" | "Effectuer"; 
  public timeZone!: string;  // Nouvelle propriété pour le fuseau horaire
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    userId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    pont: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3]], 
      },
    },
    dateDebut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateFin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Réserver", 
      validate: {
        isIn: [["Réserver", "Annuler", "Effectuer"]], 
      },
    },
    timeZone: {  // Ajout de la colonne timeZone
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "rendezvous",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Définition des relations
Client.hasMany(RendezVous, { foreignKey: "clientId" });
User.hasMany(RendezVous, { foreignKey: "userId" }); // Relation mise à jour avec `userId`
RendezVous.belongsTo(Client, { foreignKey: "clientId" });
RendezVous.belongsTo(User, { foreignKey: "userId" }); // Relation mise à jour avec `userId`

export default RendezVous;
