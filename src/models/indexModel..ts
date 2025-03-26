import sequelize from "../config/database"; 
import Facture from "./factureModels";
import Produit from "./produitModel";
import FactureProduit from "./factureProduitModel";
import FacturePrestation from "./facturePrestationModel";
import Prestation from "./prestationModels";

// Définition des relations ici
Facture.belongsToMany(Produit, { through: FactureProduit, foreignKey: "factureId" });
Produit.belongsToMany(Facture, { through: FactureProduit, foreignKey: "produitId" });
Facture.belongsToMany(Prestation, { through: FacturePrestation, foreignKey: "factureId" });
Prestation.belongsToMany(Facture, { through: FacturePrestation, foreignKey: "prestationId" });


export { sequelize, Facture, Produit, FactureProduit, Prestation, FacturePrestation };
