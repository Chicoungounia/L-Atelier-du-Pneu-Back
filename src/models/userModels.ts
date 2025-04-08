import { DataTypes, Model } from "sequelize";
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
    status?: 'Actif' | 'Inactif'; 
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
    public status!: 'Actif' | 'Inactif';
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
        speudo: {
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
            defaultValue: "Employé", // Toujours employé par défaut
            validate: {
                isIn: [["Admin", "Ouvrier", "Employé"]],
            },
        },
        hashedpassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Actif", // Toujours actif par défaut
            validate: {
                isIn: [["Actif", "Inactif"]],
            },
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        hooks: {
            beforeCreate: (user: User) => {
                // Générer speudo : prenom + espace + première lettre de nom + .
                user.speudo = `${user.prenom} ${user.nom.charAt(0)}.`;
            },
        },
    }
);

export default User;