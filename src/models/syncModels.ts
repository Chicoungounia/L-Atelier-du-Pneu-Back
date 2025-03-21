import { User } from './userModels';
import sequelize from "../config/database";
import Client from "./clientModel";
import Prestation from "./prestationModels";
import Produit from "./produitModel";
import RendezVous from "./rendezVousModel";
import Facture from './factureModels';
const syncDatabase = async () => {
    try {
    //alter: true Met à jour la structure automatiquement la structure de la base de données
    //à utiliser sans options pour utiliser les migrations en production.
    await sequelize.sync({ alter: true });
    console.log("Base de données synchronisée");
    } catch (error) {
    console.error("Erreur lors de la synchronisation :", error);
    }
   };
   export { syncDatabase, Produit, Client, RendezVous, Prestation, User, Facture };