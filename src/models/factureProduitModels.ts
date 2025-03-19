// import { DataTypes, Model } from "sequelize";
// import sequelize from "../config/database";
// import Facture from "./factureModels";
// import Produit from "./produitModel";

// class FactureProduits extends Model {
//   public factureId!: number;
//   public produitId!: number;
//   public quantite!: number;
//   public prix_htva!: number;
//   public remise!: number;
//   public tva!: number;
//   public total_ttc!: number;
// }

// FactureProduits.init(
//   {
//     factureId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: Facture,
//         key: "id",
//       },
//     },
//     produitId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: Produit,
//         key: "id",
//       },
//     },
//     quantite: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     prix_htva: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     remise: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     tva: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     total_ttc: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     tableName: "facture_produits",
//     timestamps: false,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

// // Association Many-to-Many
// Facture.belongsToMany(Produit, { through: FactureProduits, foreignKey: "factureId" });
// Produit.belongsToMany(Facture, { through: FactureProduits, foreignKey: "produitId" });

// export default FactureProduits;
