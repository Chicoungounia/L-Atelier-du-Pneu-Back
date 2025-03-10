"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const UtilisateurModel_1 = __importDefault(require("./UtilisateurModel"));
class Profil extends sequelize_1.Model {
}
Profil.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    utilisateurId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true, // 🔥 Relation 1:1 : un utilisateur ne peut avoir qu'un seul profil
        references: {
            model: UtilisateurModel_1.default,
            key: "id",
        },
    },
}, {
    sequelize: database_1.default,
    tableName: "profils",
    timestamps: true,
});
// Définition de la relation 1:1
UtilisateurModel_1.default.hasOne(Profil, { foreignKey: "utilisateurId", onDelete: "CASCADE" });
Profil.belongsTo(UtilisateurModel_1.default, { foreignKey: "utilisateurId" });
exports.default = Profil;
