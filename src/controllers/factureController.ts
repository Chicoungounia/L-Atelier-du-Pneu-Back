import { Request, Response } from "express";
import { Transaction } from "sequelize";
import sequelize from "../config/database";
import Produit from "../models/produitModel";
import Prestation from "../models/prestationModels";
import Facture from "../models/factureModels";
import FactureProduit from "../models/factureProduitModel";
import FacturePrestation from "../models/facturePrestationModel";
import RendezVous from "../models/rendezVousModel";
import { User } from "../models/userModels";

export const ajouterFacture = async (req: Request, res: Response) => {
  const {
    type,
    userId,
    clientId,
    rendezVousId,
    produits = [],
    prestations = [],
    status_payement,
    mode_payement,
  } = req.body;

  const transaction: Transaction = await sequelize.transaction();

  try {
    const taux_tva = 0.2;
    let total_htva = 0;
    let total_remise = 0;
    let total_tva = 0;
    let total = 0;

    // Vérification si l'utilisateur est actif
    const user = await User.findByPk(userId, { transaction });
    if (!user || user.status === "Inactif") {
      await transaction.rollback();
      res.status(403).json({ message: "Utilisateur inactif, création de facture interdite" });
      return;
    }

    // Création de la facture
    const nouvelleFacture = await Facture.create(
      {
        type,
        userId,
        clientId,
        rendezVousId: rendezVousId || null,
        total_htva: 0,
        total_remise: 0,
        total_tva: 0,
        total: 0,
        status_payement,
        mode_payement,
      },
      { transaction }
    );

    // Traitement des produits associés
    for (const { produitId, quantite, remise = 0 } of produits) {
      const produit = await Produit.findByPk(produitId, { transaction });
      if (!produit || produit.status === false) {
        await transaction.rollback();
        res.status(400).json({ message: `Produit ${produitId} introuvable ou inactif` });
        return;
      }

      if (type === "Facture" && produit.stock < quantite) {
        await transaction.rollback();
        res.status(400).json({ message: `Stock insuffisant pour le produit ${produitId}` });
        return;
      }

      const prix = produit.prix_htva;
      const remise_val = (prix * quantite * remise) / 100;
      const total_htva_produit = prix * quantite - remise_val;
      const tva_produit = total_htva_produit * taux_tva;
      const total_ttc_produit = total_htva_produit + tva_produit;

      total_htva += total_htva_produit;
      total_remise += remise_val;
      total_tva += tva_produit;
      total += total_ttc_produit;

      await FactureProduit.create(
        {
          factureId: nouvelleFacture.id,
          produitId,
          prix_htva: produit.prix_htva,
          quantite,
          remise,
          total_htva: total_htva_produit,
          tva: tva_produit,
          total_ttc: total_ttc_produit,
        },
        { transaction }
      );

      if (type === "Facture") {
        produit.stock -= quantite;
        await produit.save({ transaction });
      }
    }

    // Traitement des prestations associées
    for (const { prestationId, quantite, remise = 0 } of prestations) {
      const prestation = await Prestation.findByPk(prestationId, { transaction });
      if (!prestation || prestation.status === false) {
        await transaction.rollback();
        res.status(400).json({ message: `Prestation ${prestationId} introuvable ou inactive` });
        return;
      }

      const prix_htva = prestation.prix_htva;
      const remise_val = (prix_htva * quantite * remise) / 100;
      const total_htva_prestation = prix_htva * quantite - remise_val;
      const tva_prestation = total_htva_prestation * taux_tva;
      const total_ttc_prestation = total_htva_prestation + tva_prestation;

      total_htva += total_htva_prestation;
      total_remise += remise_val;
      total_tva += tva_prestation;
      total += total_ttc_prestation;

      await FacturePrestation.create(
        {
          factureId: nouvelleFacture.id,
          prestationId,
          prix_htva: prestation.prix_htva,
          quantite,
          remise,
          total_htva: total_htva_prestation,
          tva: tva_prestation,
          total_ttc: total_ttc_prestation,
        },
        { transaction }
      );
    }

    // Mise à jour des totaux de la facture
    await nouvelleFacture.update(
      {
        total_htva,
        total_remise,
        total_tva,
        total,
      },
      { transaction }
    );

    // Mise à jour du statut du rendez-vous si la facture est payée
    if (type === "Facture" && ["Payer", "A payer"].includes(status_payement) && rendezVousId) {
      const rendezVous = await RendezVous.findByPk(rendezVousId, { transaction });
      if (rendezVous) {
        await rendezVous.update({ status: "Effectuer" }, { transaction });
      }
    }

    await transaction.commit();
    res.status(201).json({ message: "Facture ajoutée avec succès", facture: nouvelleFacture });
    return;

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la facture", error });
    return;
  }
};


export const modifierFacture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { produits = [], prestations = [], status_payement, mode_payement } = req.body;

  const transaction: Transaction = await sequelize.transaction();

  try {
    const factureExistante = await Facture.findByPk(id, { transaction });
    if (!factureExistante) {
      await transaction.rollback();
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }

    if (factureExistante.type === "Devis") {
      await transaction.rollback();
      res.status(400).json({ message: "Impossible de modifier un devis" });
      return;
    }

    const taux_tva = 0.2;
    let total_htva = 0;
    let total_remise = 0;
    let total_tva = 0;
    let total = 0;

    // Récupérer les anciennes quantités des produits pour ajuster le stock
    const anciensProduits = await FactureProduit.findAll({ where: { factureId: id }, transaction });

    // Supprimer les anciennes entrées
    await FactureProduit.destroy({ where: { factureId: id }, transaction });
    await FacturePrestation.destroy({ where: { factureId: id }, transaction });

    // Ajustement du stock avant d'ajouter les nouveaux produits
    for (const ancien of anciensProduits) {
      const produit = await Produit.findByPk(ancien.produitId, { transaction });
      if (produit) {
        produit.stock += ancien.quantite; // Restituer l'ancienne quantité au stock
        await produit.save({ transaction });
      }
    }

    // Traiter les nouveaux produits
    for (const { produitId, quantite, remise = 0 } of produits) {
      const produit = await Produit.findByPk(produitId, { transaction });
      if (!produit || produit.status === false) {
        await transaction.rollback();
        res.status(400).json({ message: `Produit ${produitId} introuvable ou inactif` });
        return;
      }

      // Vérifier le stock disponible
      if (factureExistante.type === "Facture" && produit.stock < quantite) {
        await transaction.rollback();
        res.status(400).json({ message: `Stock insuffisant pour le produit ${produitId}` });
        return;
      }

      const prix = produit.prix_htva;
      const remise_val = (prix * quantite * remise) / 100;
      const total_htva_produit = prix * quantite - remise_val;
      const tva_produit = total_htva_produit * taux_tva;
      const total_ttc_produit = total_htva_produit + tva_produit;

      total_htva += total_htva_produit;
      total_remise += remise_val;
      total_tva += tva_produit;
      total += total_ttc_produit;

      await FactureProduit.create(
        { factureId: id, produitId, prix_htva: prix, quantite, remise, total_htva: total_htva_produit, tva: tva_produit, total_ttc: total_ttc_produit },
        { transaction }
      );

      // Mise à jour du stock après ajout
      if (factureExistante.type === "Facture") {
        produit.stock -= quantite;
        await produit.save({ transaction });
      }
    }

    for (const { prestationId, quantite, remise = 0 } of prestations) {
      const prestation = await Prestation.findByPk(prestationId, { transaction });
      if (!prestation || prestation.status === false) {
        await transaction.rollback();
        res.status(400).json({ message: `Prestation ${prestationId} introuvable ou inactive` });
        return;
      }

      const prix = prestation.prix_htva;
      const remise_val = (prix * quantite * remise) / 100;
      const total_htva_prestation = prix * quantite - remise_val;
      const tva_prestation = total_htva_prestation * taux_tva;
      const total_ttc_prestation = total_htva_prestation + tva_prestation;

      total_htva += total_htva_prestation;
      total_remise += remise_val;
      total_tva += tva_prestation;
      total += total_ttc_prestation;

      await FacturePrestation.create(
        { factureId: id, prestationId, prix_htva: prix, quantite, remise, total_htva: total_htva_prestation, tva: tva_prestation, total_ttc: total_ttc_prestation },
        { transaction }
      );
    }

    await factureExistante.update(
      { total_htva, total_remise, total_tva, total, status_payement, mode_payement },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Facture mise à jour avec succès", facture: factureExistante });
    return;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la facture", error });
    return;
  }
};


export const modifierTypeEtPayement = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, status_payement, mode_payement } = req.body;
  
  const transaction: Transaction = await sequelize.transaction();

  try {
    const factureExistante = await Facture.findByPk(id, { transaction });
    if (!factureExistante) {
      await transaction.rollback();
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }

    const statutsValides = ["Payer", "A payer"];
    if (status_payement && !statutsValides.includes(status_payement)) {
      await transaction.rollback();
      res.status(400).json({ message: "Statut de paiement invalide" });
      return;
    }

    // Vérification et modification du type
    let typeConvertiEnFacture = false;
    if (type && factureExistante.type === "Devis" && type === "Facture") {
      factureExistante.type = "Facture";
      typeConvertiEnFacture = true;
    } else if (type && factureExistante.type !== "Devis") {
      await transaction.rollback();
      res.status(400).json({ message: "Seuls les devis peuvent être convertis en facture" });
      return;
    }

    // Récupération des produits et ajustement du stock si le type devient "Facture"
    if (factureExistante.type === "Facture") {
      const produitsFacture = await FactureProduit.findAll({ where: { factureId: id }, transaction });
      for (const produitFacture of produitsFacture) {
        const produit = await Produit.findByPk(produitFacture.produitId, { transaction });
        if (produit) {
          if (produit.stock < produitFacture.quantite) {
            await transaction.rollback();
            res.status(400).json({ message: `Stock insuffisant pour le produit ${produit.id}` });
            return;
          }
          produit.stock -= produitFacture.quantite;
          await produit.save({ transaction });
        }
      }
    }

    // Mise à jour du statut du rendez-vous si le type devient "Facture"
    if (typeConvertiEnFacture && factureExistante.rendezVousId) {
      const rendezVous = await RendezVous.findByPk(factureExistante.rendezVousId, { transaction });
      if (rendezVous) {
        await rendezVous.update({ status: "Effectuer" }, { transaction });
      }
    }

    // Mise à jour des champs
    if (status_payement) factureExistante.status_payement = status_payement;
    if (mode_payement) factureExistante.mode_payement = mode_payement;
    await factureExistante.save({ transaction });

    await transaction.commit();
    res.status(200).json({
      message: "Facture mise à jour avec succès, stock et rendez-vous ajustés",
      facture: factureExistante,
    });
    return;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la facture", error });
    return;
  }
};

export const afficherAllFactures = async (req: Request, res: Response) => {
  try {
    const factures = await Facture.findAll();
    res.status(200).json({ message: "Toutes les factures récupérées avec succès", factures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des factures", error });
  }
};


export const afficherUne = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const facture = await Facture.findByPk(id);
    if (!facture) {
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }
    res.status(200).json({ message: "Facture récupérée avec succès", facture });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de la facture", error });
    return;
  }
};

export const afficherTypeDevis = async (req: Request, res: Response) => {
  try {
    const devis = await Facture.findAll({ where: { type: "Devis" } });
    res.json(devis);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des devis", error });
  }
};

export const afficherTypeFactures = async (req: Request, res: Response) => {
  try {
    const facture = await Facture.findAll({ where: { type: "Facture" } });
    res.json(facture);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des devis", error });
  }
};

export const afficherAllApayer = async (req: Request, res: Response) => {
  try {
    const factures = await Facture.findAll({
      where: {
        type: "Facture",
        status_payement: "A payer",
      },
    });

    res.json(factures);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des factures à payer", error });
  }
};
