import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Définition des attributs d'un utilisateur
interface UserAttributes {
    id?: number;
    nom: string;
    prenom: string;
    speudo: string;
    email: string;
    role?: 'Admin' | 'Ouvrier' | 'Employé';
    hashedpassword: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public nom!: string;
    public prenom!: string;
    public speudo!: string;
    public email!: string;
    public role!: 'Admin' | 'Ouvrier' | 'Employé';
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
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        speudo: { // Correction de "speudo"
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
            defaultValue: 'Employé', // Correction du défaut pour correspondre aux valeurs valides
            validate: {
                isIn: [['Admin', 'Ouvrier', 'Employé']], // Correction des valeurs autorisées
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
        timestamps: true, // Assure la gestion automatique de createdAt & updatedAt
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);