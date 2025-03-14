import { Request, Response } from "express";
import Produit from "../models/produitModel";

export const ajouterProduit = async (req: Request, res: Response) => {
  try {
    const {
      saison,
      marque,
      modele,
      Largeur_pneu,
      profil_pneu,
      type_pneu,
      diametre,
      indice_charge,
      indice_vitesse,
      renfort,
      stock,
      prix,
      image,
    } = req.body;

    // Vérification des données requises
    if (
      !saison || !marque || !modele || !Largeur_pneu || !profil_pneu || 
      !type_pneu || !diametre || !indice_charge || !indice_vitesse || 
      !renfort || stock === undefined || prix === undefined || !image
    ) {
      res.status(400).json({ message: "Tous les champs sont requis." });
      return;
    }

  

    // Création du produit
    const produit = await Produit.create({
      saison,
      marque,
      modele,
      Largeur_pneu,
      profil_pneu,
      type_pneu,
      diametre,
      indice_charge,
      indice_vitesse,
      renfort,
      stock,
      prix,
      image
    });

    res.status(201).json({ message: "Produit ajouté avec succès", produit });
    return;

  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

// Modifier un produit
export const modifierProduit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      saison,
      marque,
      modele,
      Largeur_pneu,
      profil_pneu,
      type_pneu,
      diametre,
      indice_charge,
      indice_vitesse,
      renfort,
      stock,
      prix,
      image,
    } = req.body;

    // Vérification que l'ID est un nombre valide
    if (isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Recherche du produit par ID
    const produit = await Produit.findByPk(id);

    // Vérification si le produit existe
    if (!produit) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }

    // Mise à jour des propriétés du produit
    const updatedProduit = await produit.update({
      saison: saison || produit.saison, // Si saison est fourni, mettre à jour, sinon garder l'ancienne valeur
      marque: marque || produit.marque,
      modele: modele || produit.modele,
      Largeur_pneu: Largeur_pneu || produit.Largeur_pneu,
      profil_pneu: profil_pneu || produit.profil_pneu,
      type_pneu: type_pneu || produit.type_pneu,
      diametre: diametre || produit.diametre,
      indice_charge: indice_charge || produit.indice_charge,
      indice_vitesse: indice_vitesse || produit.indice_vitesse,
      renfort: renfort || produit.renfort,
      stock: stock !== undefined ? stock : produit.stock, // Si stock est fourni, utiliser sinon garder l'ancien
      prix: prix !== undefined ? prix : produit.prix, // De même pour prix
      image: image || produit.image,
    });

    // Réponse succès avec le produit mis à jour
    res.status(200).json({ message: "Produit modifié avec succès", produit: updatedProduit });
  } catch (error) {
    console.error("Erreur lors de la modification du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


export const deleteProduit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est un nombre valide
    if (isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Recherche du produit par ID
    const produit = await Produit.findByPk(id);

    if (!produit) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }

    // Suppression du produit
    await produit.destroy();

    res.status(200).json({ message: "Produit supprimé avec succès" });
    return;

  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};
