// import { Request, Response } from "express";
// import sequelize from "../config/database";
// import Facture from "../models/factureModels";
// import FactureProduits from "../models/factureProduitModels";
// import FacturePrestations from "../models/facturePrestationModels";

// class FactureController {
//   // ✅ Ajouter une facture avec produits et prestations associées
//   static async ajouterFacture(req: Request, res: Response) {
//     const t = await sequelize.transaction();

//     try {
//       const { type, userId, clientId, produits, prestations } = req.body;

//       // Vérifier que les données obligatoires sont fournies
//       if (!type || !userId || !clientId || !produits || !prestations) {
//         res.status(400).json({ message: "Tous les champs sont requis." });
//         return;
//       }

//       // Création de la facture
//       const facture = await Facture.create(
//         {
//           type,
//           userId,
//           clientId,
//           totalhtva: 0,
//           totalremise: 0,
//           tva: 0,
//           total: 0,
//         },
//         { transaction: t }
//       );

//       let totalHTVA = 0;
//       let totalRemise = 0;
//       let totalTVA = 0;
//       let totalTTC = 0;

//       // ✅ Ajout des produits à la facture
//       for (const produit of produits) {
//         const { produitId, quantite, prix_htva, remise, tva } = produit;
//         const total_ttc = (prix_htva - remise) * (1 + tva / 100) * quantite;

//         await FactureProduits.create(
//           {
//             factureId: facture.id,
//             produitId,
//             quantite,
//             prix_htva,
//             remise,
//             tva,
//             total_ttc,
//           },
//           { transaction: t }
//         );

//         totalHTVA += prix_htva * quantite;
//         totalRemise += remise * quantite;
//         totalTVA += (prix_htva - remise) * (tva / 100) * quantite;
//         totalTTC += total_ttc;
//       }

//       // ✅ Ajout des prestations à la facture
//       for (const prestation of prestations) {
//         const { prestationId, prix_htva, remise, tva } = prestation;
//         const total_ttc = (prix_htva - remise) * (1 + tva / 100);

//         await FacturePrestations.create(
//           {
//             factureId: facture.id,
//             prestationId,
//             prix_htva,
//             remise,
//             tva,
//             total_ttc,
//           },
//           { transaction: t }
//         );

//         totalHTVA += prix_htva;
//         totalRemise += remise;
//         totalTVA += (prix_htva - remise) * (tva / 100);
//         totalTTC += total_ttc;
//       }

//       // ✅ Mise à jour du total de la facture
//       await facture.update(
//         {
//           totalhtva: totalHTVA,
//           totalremise: totalRemise,
//           tva: totalTVA,
//           total: totalTTC,
//         },
//         { transaction: t }
//       );

//       await t.commit();
//       res.status(201).json({ message: "Facture créée avec succès", facture });
//       return;
//     } catch (error) {
//       await t.rollback();
//       console.error(error);
//       res.status(500).json({ message: "Erreur lors de la création de la facture" });
//       return;
//     }
//   }
// }

// export default FactureController;


import { Request, Response } from "express";
import sequelize from "../config/database";
import Facture from "../models/factureModels";
import FactureProduits from "../models/factureProduitModels";
import FacturePrestations from "../models/facturePrestationModels";

class FactureController {
  // ✅ Ajouter une facture avec produits et prestations associées
  static async ajouterFacture(req: Request, res: Response) {
    const t = await sequelize.transaction();

    try {
      const { type, userId, clientId, produits, prestations } = req.body;

      // Vérification des données requises
      if (!type || !userId || !clientId) {
        res.status(400).json({ message: "Les champs type, userId et clientId sont requis." });
        return;
      }

      // Création de la facture
      const facture = await Facture.create(
        { type, userId, clientId, totalhtva: 0, totalremise: 0, tva: 0, total: 0 },
        { transaction: t }
      );

      let totalHTVA = 0;
      let totalRemise = 0;
      let totalTVA = 0;
      let totalTTC = 0;

      // ✅ Ajout des produits à la facture
      if (produits && produits.length > 0) {
        for (const produit of produits) {
          const { produitId, quantite, prix_htva, remise, remiseType, tva = 20 } = produit;

          if (!quantite || !prix_htva) {
            res.status(400).json({ message: "Quantité et prix HTVA sont requis pour un produit." });
            return;
          }

          // Calcul de la remise en fonction du type (pourcentage ou montant)
          const remiseFinale =
            remiseType === "pourcentage" ? (prix_htva * remise) / 100 : remise;

          const total_ttc = (prix_htva - remiseFinale) * (1 + tva / 100) * quantite;

          await FactureProduits.create(
            {
              factureId: facture.id,
              produitId: produitId || null, // Permet d'avoir null
              quantite,
              prix_htva,
              remise: parseFloat(remiseFinale.toFixed(2)), // Arrondi à 2 décimales
              tva,
              total_ttc,
            },
            { transaction: t }
          );

          totalHTVA += prix_htva * quantite;
          totalRemise += remiseFinale * quantite;
          totalTVA += (prix_htva - remiseFinale) * (tva / 100) * quantite;
          totalTTC += total_ttc;
        }
      }

      // ✅ Ajout des prestations à la facture
      if (prestations && prestations.length > 0) {
        for (const prestation of prestations) {
          const { prestationId, quantite, prix_htva, remise, remiseType, tva = 20 } = prestation;

          if (!quantite || !prix_htva) {
            res.status(400).json({ message: "Quantité et prix HTVA sont requis pour une prestation." });
            return;
          }

          // Calcul de la remise en fonction du type (pourcentage ou montant)
          const remiseFinale =
            remiseType === "pourcentage" ? (prix_htva * remise) / 100 : remise;

          const total_ttc = (prix_htva - remiseFinale) * (1 + tva / 100) * quantite;

          await FacturePrestations.create(
            {
              factureId: facture.id,
              prestationId: prestationId || null, // Permet d'avoir null
              quantite,
              prix_htva,
              remise: parseFloat(remiseFinale.toFixed(2)), // Arrondi à 2 décimales
              tva,
              total_ttc,
            },
            { transaction: t }
          );

          totalHTVA += prix_htva * quantite;
          totalRemise += remiseFinale * quantite;
          totalTVA += (prix_htva - remiseFinale) * (tva / 100) * quantite;
          totalTTC += total_ttc;
        }
      }

      // ✅ Mise à jour du total de la facture
      await facture.update(
        {
          totalhtva: totalHTVA,
          totalremise: parseFloat(totalRemise.toFixed(2)), // Arrondi à 2 décimales
          tva: totalTVA,
          total: totalTTC,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json({ message: "Facture créée avec succès", facture });
      return;
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la création de la facture" });
      return;
    }
  }
}

export default FactureController;
