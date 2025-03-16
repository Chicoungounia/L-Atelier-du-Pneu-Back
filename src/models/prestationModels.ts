import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Définition des attributs de la prestation
interface PrestationAttributes {
  id?: number;
  travail: string;
  description: string;
  prix: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrestationCreationAttributes extends Optional<PrestationAttributes, "id"> {}

class Prestation extends Model<PrestationAttributes, PrestationCreationAttributes>
  implements PrestationAttributes {
  public id!: number;
  public travail!: string;
  public description!: string;
  public prix!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Prestation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    travail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "prestations",
    timestamps: true, // Active automatiquement createdAt et updatedAt
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Prestation;
