import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Définition des attributs d'un utilisateur
interface UserAttributes {
    id?: number;
    first_name: string;
    surname: string;
    email: string;
    role?: 'Admin' | 'Storekeeper' | 'Employee';
    hashedpassword: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public first_name!: string;
    public surname!: string;
    public email!: string;
    public role!: 'Admin' | 'Storekeeper' | 'Employee';
    public hashedpassword!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Employee',
            validate: {
                isIn: [['Admin', 'Storekeeper', 'Employee']],
            },
        },
        hashedpassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);