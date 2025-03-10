"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Produit.model.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Produit extends sequelize_1.Model {
}
Produit.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    prix: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: "produits",
    timestamps: true,
});
exports.default = Produit;
