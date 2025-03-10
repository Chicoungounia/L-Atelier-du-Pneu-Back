"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Commande.model.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const clientModel_1 = __importDefault(require("./clientModel"));
const produitModel_1 = __importDefault(require("./produitModel"));
class Commande extends sequelize_1.Model {
}
Commande.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    client_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: clientModel_1.default,
            key: "id",
        },
    },
    produit_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: produitModel_1.default,
            key: "id",
        },
    },
    quantite: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    tableName: "commandes",
    timestamps: true,
});
clientModel_1.default.hasMany(Commande, { foreignKey: "client_id", onDelete: "CASCADE" });
produitModel_1.default.hasMany(Commande, { foreignKey: "produit_id", onDelete: "CASCADE" });
Commande.belongsTo(clientModel_1.default, { foreignKey: "client_id" });
Commande.belongsTo(produitModel_1.default, { foreignKey: "produit_id" });
exports.default = Commande;
