import { Request, Response } from "express";
import { Transaction } from "sequelize";
import sequelize from "../config/database";
import Produit from "../models/produitModel";
import Prestation from "../models/prestationModels";
import Facture from "../models/factureModels";

export const ajouterFacture = async (req: Request, res: Response) => {
  const {
    type,
    userId,
    clientId,
    produitId,
    prestationId,
    prix_htva_produit,
    quantite_produit,
    remise_produit,
    tva_produit,
    total_ttc_produit,
    prix_htva_prestation,
    quantite_prestation,
    remise_prestation,
    tva_prestation,
    total_ttc_prestation,
    total_htva,
    total_remise,
    total_tva,
    total,
  } = req.body;

  const transaction: Transaction = await sequelize.transaction();

  try {
    // Vérification de l'existence du produit et du stock si c'est une Facture
    if (type === "Facture") {
      const produit = await Produit.findByPk(produitId, { transaction });
      if (!produit) {
        await transaction.rollback();
        res.status(404).json({ message: "Produit introuvable" });
        return;
      }

      if (produit.stock < quantite_produit) {
        await transaction.rollback();
        res.status(400).json({ message: "Stock insuffisant pour ce produit" });
        return;
      }

      // Mise à jour du stock du produit
      produit.stock -= quantite_produit;
      await produit.save({ transaction });
    }

    // Vérification de l'existence de la prestation
    const prestation = await Prestation.findByPk(prestationId, { transaction });
    if (!prestation) {
      await transaction.rollback();
      res.status(404).json({ message: "Prestation introuvable" });
      return;
    }

    // Création de la facture
    const nouvelleFacture = await Facture.create(
      {
        type,
        userId,
        clientId,
        produitId,
        prestationId,
        prix_htva_produit,
        quantite_produit,
        remise_produit,
        tva_produit,
        total_ttc_produit,
        prix_htva_prestation,
        quantite_prestation,
        remise_prestation,
        tva_prestation,
        total_ttc_prestation,
        total_htva,
        total_remise,
        total_tva,
        total,
      },
      { transaction }
    );

    // Valider la transaction
    await transaction.commit();

    res.status(201).json({
      message: "Facture ajoutée avec succès",
      facture: nouvelleFacture,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la facture", error });
  }
};

export const modifierFacture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    type,
    userId,
    clientId,
    produitId,
    prestationId,
    prix_htva_produit,
    quantite_produit,
    remise_produit,
    tva_produit,
    total_ttc_produit,
    prix_htva_prestation,
    quantite_prestation,
    remise_prestation,
    tva_prestation,
    total_ttc_prestation,
    total_htva,
    total_remise,
    total_tva,
    total,
  } = req.body;

  const transaction: Transaction = await sequelize.transaction();

  try {
    // Vérifier si la facture existe
    const factureExistante = await Facture.findByPk(id, { transaction });
    if (!factureExistante) {
      await transaction.rollback();
      res.status(404).json({ message: "Facture introuvable" });
      return;
    }

    // Vérification de l'existence du produit et gestion du stock si c'est une Facture
    if (type === "Facture") {
      const produit = await Produit.findByPk(produitId, { transaction });
      if (!produit) {
        await transaction.rollback();
        res.status(404).json({ message: "Produit introuvable" });
        return;
      }

      // Réajuster le stock si la quantité du produit a changé
      if (factureExistante.produitId !== produitId || factureExistante.quantite_produit !== quantite_produit) {
        // Rétablir l'ancien stock
        const ancienProduit = await Produit.findByPk(factureExistante.produitId, { transaction });
        if (ancienProduit) {
          ancienProduit.stock += factureExistante.quantite_produit;
          await ancienProduit.save({ transaction });
        }

        // Vérifier le stock du nouveau produit
        if (produit.stock < quantite_produit) {
          await transaction.rollback();
          res.status(400).json({ message: "Stock insuffisant pour ce produit" });
          return;
        }

        // Mettre à jour le stock du nouveau produit
        produit.stock -= quantite_produit;
        await produit.save({ transaction });
      }
    }

    // Vérification de l'existence de la prestation
    const prestation = await Prestation.findByPk(prestationId, { transaction });
    if (!prestation) {
      await transaction.rollback();
      res.status(404).json({ message: "Prestation introuvable" });
      return;
    }

    // Mettre à jour la facture
    await factureExistante.update(
      {
        type,
        userId,
        clientId,
        produitId,
        prestationId,
        prix_htva_produit,
        quantite_produit,
        remise_produit,
        tva_produit,
        total_ttc_produit,
        prix_htva_prestation,
        quantite_prestation,
        remise_prestation,
        tva_prestation,
        total_ttc_prestation,
        total_htva,
        total_remise,
        total_tva,
        total,
      },
      { transaction }
    );

    // Valider la transaction
    await transaction.commit();

    res.status(200).json({
      message: "Facture mise à jour avec succès",
      facture: factureExistante,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la facture", error });
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
    if (factureExistante.type === "Facture") {
      const produit = await Produit.findByPk(factureExistante.produitId, { transaction });
      if (produit) {
        produit.stock += factureExistante.quantite_produit;
        await produit.save({ transaction });
      }
    }

    // Supprimer la facture
    await factureExistante.destroy({ transaction });

    // Valider la transaction
    await transaction.commit();

    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la facture", error });
  }
};
