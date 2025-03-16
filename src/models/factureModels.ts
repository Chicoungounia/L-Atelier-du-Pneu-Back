// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../config/database";
// import { User } from "./userModels";
// import Client from "./clientModel";
// import Produit from "./produitModel";

// // Définition des attributs de la facture
// interface FactureAttributes {
//   id?: number;
//   type: 'Devis' | 'Facture';
//   userId: number;
//   clientId: number;
//   produitId: number;
//   prestationId: number;
//   prix_htva_produit: number;
//   remise_produit: number;
//   tva_produit: number;
//   total_ttc_produit: number;
//   prix_htva_prestation: number;
//   remise_prestation: number;
//   tva_prestation: number;
//   total_ttc_prestation: number;
//   totalhtva: number;
//   totalremise: number;
//   tva: number;
//   total: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // Définition des attributs requis pour la création d'une facture
// interface FactureCreationAttributes extends Optional<FactureAttributes, "id"> {}

// // Modèle de Facture
// class Facture extends Model<FactureAttributes, FactureCreationAttributes> implements FactureAttributes {
//   public id!: number;
//   public type!: 'Devis' | 'Facture';
//   public userId!: number;
//   public clientId!: number;
//   public produitId!: number;
//   public prestationId!: number;
//   public prix_htva_produit!: number;
//   public remise_produit!: number;
//   public tva_produit!: number;
//   public total_ttc_produit!: number;
//   public prix_htva_prestation!: number;
//   public remise_prestation!: number;
//   public tva_prestation!: number;
//   public total_ttc_prestation!: number;
//   public totalhtva!: number;
//   public totalremise!: number;
//   public tva!: number;
//   public total!: number;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// // Initialisation du modèle Facture
// Facture.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     type: {
//       type: DataTypes.ENUM('Devis', 'Facture'),
//       allowNull: false,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User,
//         key: "id",
//       },
//     },
//     clientId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: Client,
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
//     prestationId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     prix_htva_produit: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     remise_produit: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     tva_produit: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     total_ttc_produit: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     prix_htva_prestation: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     remise_prestation: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     tva_prestation: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     total_ttc_prestation: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     totalhtva: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     totalremise: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     tva: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     total: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     tableName: "factures",
//     timestamps: true,
//   }
// );

// // Définition des associations
// Facture.belongsTo(User, { foreignKey: "userId" });
// Facture.belongsTo(Client, { foreignKey: "clientId" });
// Facture.belongsTo(Produit, { foreignKey: "produitId" });

// export default Facture;

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./userModels";
import Client from "./clientModel";
import Produit from "./produitModel";
import Prestation from "./prestationModels";

// Définition des attributs de la facture
interface FactureAttributes {
  id?: number;
  type: "Devis" | "Facture";
  userId: number;
  clientId: number;
  totalhtva: number;
  totalremise: number;
  tva: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Définition des attributs requis pour la création d'une facture
interface FactureCreationAttributes extends Optional<FactureAttributes, "id"> {}

// Modèle de Facture
class Facture extends Model<FactureAttributes, FactureCreationAttributes> implements FactureAttributes {
  public id!: number;
  public type!: 'Facture' | 'Devis';
  public userId!: number;
  public clientId!: number;
  public totalhtva!: number;
  public totalremise!: number;
  public tva!: number;
  public total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialisation du modèle Facture
Facture.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("Facture", "Devis"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
    totalhtva: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalremise: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tva: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "factures",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Définition des associations
Facture.belongsTo(User, { foreignKey: "userId" });
Facture.belongsTo(Client, { foreignKey: "clientId" });

export default Facture;
