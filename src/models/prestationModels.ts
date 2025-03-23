import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PrestationAttributes {
  id?: number;
  travail: string;
  description: string;
  prix_htva: number;
  status?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrestationCreationAttributes extends Optional<PrestationAttributes, "id"> {}

class Prestation extends Model<PrestationAttributes, PrestationCreationAttributes>
  implements PrestationAttributes {
  public id!: number;
  public travail!: string;
  public description!: string;
  public prix_htva!: number;
  public status!: Boolean;
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
    prix_htva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
