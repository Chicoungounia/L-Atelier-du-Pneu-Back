import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Utilisateur from "./utilisateurModel";


// Définition des attributs d'un profil
interface ProfilAttributes {
    id?: number;
    bio: string;
    avatarUrl?: string;
    utilisateurId: number; // Clé étrangère vers Utilisateur
    createdAt?: Date;
    updatedAt?: Date;
}

class Profil extends Model<ProfilAttributes> implements ProfilAttributes {
    public id!: number;
    public bio!: string;
    public avatarUrl?: string;
    public utilisateurId!: number; // FK obligatoire
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Profil.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatarUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        utilisateurId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // 🔥 Relation 1:1 : un utilisateur ne peut avoir qu'un seul profil
            references: {
                model: Utilisateur,
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "profils",
        timestamps: true,
    }
);

// Définition de la relation 1:1
Utilisateur.hasOne(Profil, { foreignKey: "utilisateurId", onDelete: "CASCADE" });
Profil.belongsTo(Utilisateur, { foreignKey: "utilisateurId" });

export default Profil;