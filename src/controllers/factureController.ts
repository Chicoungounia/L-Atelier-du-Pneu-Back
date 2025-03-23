import { Request, Response } from "express";
import { Transaction } from "sequelize";
import sequelize from "../config/database";
import Produit from "../models/produitModel";
import Prestation from "../models/prestationModels";
import Facture from "../models/factureModels";
import RendezVous from "../models/rendezVousModel";
import { User } from "../models/userModels";

export const ajouterFacture = async (req: Request, res: Response) => {
  const {
    type,
    userId,
    clientId,
    rendezVousId, 
    produitId,
    prestationId,
    quantite_produit = 0,
    remise_produit = 0,
    quantite_prestation = 0,
    remise_prestation = 0,
    status_payement,
    mode_payement,
  } = req.body;

  const transaction: Transaction = await sequelize.transaction();

  try {
    let prix_htva_produit = 0, total_htva_produit = 0, tva_produit = 0, total_ttc_produit = 0;
    let prix_htva_prestation = 0, total_htva_prestation = 0, tva_prestation = 0, total_ttc_prestation = 0;
    let total_remise = 0;
    const taux_tva = 0.2;

    // Vérification si l'utilisateur est actif
    const user = await User.findByPk(userId, { transaction });
    if (!user || user.status === "Inactif") {
      await transaction.rollback();
      res.status(403).json({ message: "Utilisateur inactif, création de facture interdite" });
      return;
    }

    if (produitId) {
      const produit = await Produit.findByPk(produitId, { transaction });
      if (!produit) {
        await transaction.rollback();
        res.status(404).json({ message: "Produit introuvable" });
        return;
      }
      if (produit.status === false) {
        await transaction.rollback();
        res.status(400).json({ message: "Le produit sélectionné est inactif" });
        return;
      }
      if (type === "Facture" && produit.stock < quantite_produit) {
        await transaction.rollback();
        res.status(400).json({ message: "Stock insuffisant" });
        return;
      }
      prix_htva_produit = produit.prix;
      const remise_produit_val = (prix_htva_produit * quantite_produit * remise_produit) / 100;
      total_htva_produit = prix_htva_produit * quantite_produit - remise_produit_val;
      tva_produit = total_htva_produit * taux_tva;
      total_ttc_produit = total_htva_produit + tva_produit;
      total_remise += remise_produit_val;
      if (type === "Facture") {
        produit.stock -= quantite_produit;
        await produit.save({ transaction });
      }
    }

    if (prestationId) {
      const prestation = await Prestation.findByPk(prestationId, { transaction });
      if (!prestation) {
        await transaction.rollback();
        res.status(404).json({ message: "Prestation introuvable" });
        return;
      }
      if (prestation.status === false) {
        await transaction.rollback();
        res.status(400).json({ message: "La prestation sélectionnée est inactive" });
        return;
      }
      prix_htva_prestation = prestation.prix;
      const remise_prestation_val = (prix_htva_prestation * quantite_prestation * remise_prestation) / 100;
      total_htva_prestation = prix_htva_prestation * quantite_prestation - remise_prestation_val;
      tva_prestation = total_htva_prestation * taux_tva;
      total_ttc_prestation = total_htva_prestation + tva_prestation;
      total_remise += remise_prestation_val;
    }

    const total_htva = total_htva_produit + total_htva_prestation;
    const total_tva = tva_produit + tva_prestation;
    const total = total_ttc_produit + total_ttc_prestation;

    const nouvelleFacture = await Facture.create(
      {
        type,
        userId,
        clientId,
        rendezVousId: rendezVousId || null,
        produitId: produitId || null,
        prestationId: prestationId || null,
        prix_htva_produit,
        quantite_produit,
        remise_produit,
        total_htva_produit,
        tva_produit,
        total_ttc_produit,
        prix_htva_prestation,
        quantite_prestation,
        remise_prestation,
        total_htva_prestation,
        tva_prestation,
        total_ttc_prestation,
        total_htva,
        total_remise,
        total_tva,
        total,
        status_payement,
        mode_payement,
      },
      { transaction }
    );

    // 🔹 Si la facture est payée, mettre à jour le statut du rendez-vous lié
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
  const {
    userId,
    clientId,
    produitId,
    prestationId,
    quantite_produit = 0,
    remise_produit = 0,
    quantite_prestation = 0,
    remise_prestation = 0,
  } = req.body;

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
      res.status(400).json({ message: "Impossible de convertir un devis en facture" });
      return;
    }

    let prix_htva_produit = 0, total_htva_produit = 0, tva_produit = 0, total_ttc_produit = 0;
    let prix_htva_prestation = 0, total_htva_prestation = 0, tva_prestation = 0, total_ttc_prestation = 0;
    let total_remise = 0;
    const taux_tva = 0.2;

    if (factureExistante.produitId) {
      const ancienProduit = await Produit.findByPk(factureExistante.produitId, { transaction });
      if (ancienProduit) {
        ancienProduit.stock += factureExistante.quantite_produit || 0;
        await ancienProduit.save({ transaction });
      }
    }

    if (produitId) {
      const produit = await Produit.findByPk(produitId, { transaction });
      if (!produit) {
        await transaction.rollback();
        res.status(404).json({ message: "Produit introuvable" });
        return;
      }

      if (factureExistante.type === "Facture" && produit.stock < quantite_produit) {
        await transaction.rollback();
        res.status(400).json({ message: "Stock insuffisant" });
        return;
      }

      prix_htva_produit = produit.prix;
      const remise_produit_val = (prix_htva_produit * quantite_produit * remise_produit) / 100;
      total_htva_produit = prix_htva_produit * quantite_produit - remise_produit_val;
      tva_produit = total_htva_produit * taux_tva;
      total_ttc_produit = total_htva_produit + tva_produit;
      total_remise += remise_produit_val;

      if (factureExistante.type === "Facture") {
        produit.stock -= quantite_produit;
        await produit.save({ transaction });
      }
    }

    if (prestationId) {
      const prestation = await Prestation.findByPk(prestationId, { transaction });
      if (!prestation) {
        await transaction.rollback();
        res.status(404).json({ message: "Prestation introuvable" });
        return;
      }

      prix_htva_prestation = prestation.prix;
      const remise_prestation_val = (prix_htva_prestation * quantite_prestation * remise_prestation) / 100;
      total_htva_prestation = prix_htva_prestation * quantite_prestation - remise_prestation_val;
      tva_prestation = total_htva_prestation * taux_tva;
      total_ttc_prestation = total_htva_prestation + tva_prestation;
      total_remise += remise_prestation_val;
    }

    const total_htva = total_htva_produit + total_htva_prestation;
    const total_tva = tva_produit + tva_prestation;
    const total = total_ttc_produit + total_ttc_prestation;

    await factureExistante.update(
      {
        userId,
        clientId,
        produitId: produitId || null,
        prestationId: prestationId || null,
        prix_htva_produit,
        quantite_produit,
        remise_produit,
        total_htva_produit,
        tva_produit,
        total_ttc_produit,
        prix_htva_prestation,
        quantite_prestation,
        remise_prestation,
        total_htva_prestation,
        tva_prestation,
        total_ttc_prestation,
        total_htva,
        total_remise,
        total_tva,
        total,
      },
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

export const modifierStatusModePayement = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status_payement, mode_payement } = req.body;

  const transaction: Transaction = await sequelize.transaction();

  try {
    const factureExistante = await Facture.findByPk(id, { transaction });

    if (!factureExistante) {
      await transaction.rollback();
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }

    // Vérifier si le statut est valide
    const statutsValides = ["Payer", "A payer", "Annulé"];
    if (status_payement && !statutsValides.includes(status_payement)) {
      await transaction.rollback();
      res.status(400).json({ message: "Statut de paiement invalide" });
      return;
    }

    // Mise à jour des champs
    factureExistante.status_payement = status_payement;
    factureExistante.mode_payement = mode_payement;

    await factureExistante.save({ transaction }); // ✅ Assure l'enregistrement en DB

    await transaction.commit(); // ✅ Valide la transaction
    res.status(200).json({
      message: "Statut et mode de paiement mis à jour avec succès",
      facture: factureExistante,
    });
    return;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du paiement", error });
    return;
  }
};

export const modifierTypeFacture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction: Transaction = await sequelize.transaction();

  try {
    const facture = await Facture.findByPk(id, { transaction });

    if (!facture) {
      await transaction.rollback();
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }

    if (facture.type !== "Devis") {
      await transaction.rollback();
      res.status(400).json({ message: "Seuls les devis peuvent être convertis en factures" });
      return;
    }

    let prix_htva_produit = 0, total_htva_produit = 0, tva_produit = 0, total_ttc_produit = 0;
    let prix_htva_prestation = 0, total_htva_prestation = 0, tva_prestation = 0, total_ttc_prestation = 0;
    let total_remise = 0;
    const taux_tva = 0.2;

    if (facture.produitId) {
      const produit = await Produit.findByPk(facture.produitId, { transaction });

      if (!produit) {
        await transaction.rollback();
        res.status(404).json({ message: "Produit introuvable" });
        return;
      }

      const quantite_produit = facture.quantite_produit || 0;
      const remise_produit = facture.remise_produit || 0;

      if (produit.stock < quantite_produit) {
        await transaction.rollback();
        res.status(400).json({ message: "Stock insuffisant" });
        return;
      }

      prix_htva_produit = produit.prix;
      const remise_produit_val = (prix_htva_produit * quantite_produit * remise_produit) / 100;
      total_htva_produit = prix_htva_produit * quantite_produit - remise_produit_val;
      tva_produit = total_htva_produit * taux_tva;
      total_ttc_produit = total_htva_produit + tva_produit;
      total_remise += remise_produit_val;

      produit.stock -= quantite_produit;
      await produit.save({ transaction });
    }

    if (facture.prestationId) {
      const prestation = await Prestation.findByPk(facture.prestationId, { transaction });

      if (!prestation) {
        await transaction.rollback();
        res.status(404).json({ message: "Prestation introuvable" });
        return;
      }

      const quantite_prestation = facture.quantite_prestation || 0;
      const remise_prestation = facture.remise_prestation || 0;

      prix_htva_prestation = prestation.prix;
      const remise_prestation_val = (prix_htva_prestation * quantite_prestation * remise_prestation) / 100;
      total_htva_prestation = prix_htva_prestation * quantite_prestation - remise_prestation_val;
      tva_prestation = total_htva_prestation * taux_tva;
      total_ttc_prestation = total_htva_prestation + tva_prestation;
      total_remise += remise_prestation_val;
    }

    const total_htva = total_htva_produit + total_htva_prestation;
    const total_tva = tva_produit + tva_prestation;
    const total = total_ttc_produit + total_ttc_prestation;

    await facture.update(
      {
        type: "Facture",
        prix_htva_produit,
        total_htva_produit,
        tva_produit,
        total_ttc_produit,
        prix_htva_prestation,
        total_htva_prestation,
        tva_prestation,
        total_ttc_prestation,
        total_htva,
        total_remise,
        total_tva,
        total,
      },
      { transaction }
    );

    // 🔹 Si la facture est payée, mettre à jour le statut du rendez-vous lié
    if (facture.rendezVousId) {
      const rendezVous = await RendezVous.findByPk(facture.rendezVousId, { transaction });

      if (rendezVous) {
        await rendezVous.update({ status: "Effectuer" }, { transaction });
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Facture convertie avec succès", facture });
    return;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la conversion du devis en facture", error });
    return;
  }
};

export const supprimerFacture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction: Transaction = await sequelize.transaction();

  try {
    // Vérifier si la facture existe
    const factureExistante = await Facture.findByPk(id, { transaction });
    if (!factureExistante) {
      await transaction.rollback();
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }

    // Restaurer le stock du produit si c'est une Facture
    if (factureExistante.type === "Facture" && factureExistante.produitId) {
      const produit = await Produit.findByPk(factureExistante.produitId, { transaction });
      if (produit && factureExistante.quantite_produit) {
        produit.stock += factureExistante.quantite_produit;
        await produit.save({ transaction });
      }
    }

    // Supprimer la facture
    await factureExistante.destroy({ transaction });

    // Valider la transaction
    await transaction.commit();

    res.status(200).json({ message: "Facture supprimée avec succès" });
    return;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la facture", error });
    return;
  }
};

export const recupererToutesLesFactures = async (req: Request, res: Response) => {
  try {
    const factures = await Facture.findAll();
    res.status(200).json({ message: "Liste des factures récupérée avec succès", factures });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des factures", error });
    return;
  }
};

export const recupererUneFacture = async (req: Request, res: Response) => {
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


