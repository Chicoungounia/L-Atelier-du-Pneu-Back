import { Request, Response } from "express";
import Produit from "../models/produitModel";
import sequelize from "../config/database";

export const ajouterProduit = async (req: Request, res: Response) => {
  try {
    const {
      saison,
      marque,
      modele,
      largeur_pneu,
      profil_pneu,
      type_pneu,
      diametre,
      indice_charge,
      indice_vitesse,
      renfort,
      stock,
      prix_htva,
      image,
    } = req.body;

    // Vérification des données requises
    if (
      !saison || !marque || !modele || !largeur_pneu || !profil_pneu || 
      !type_pneu || !diametre || !indice_charge || !indice_vitesse || 
      !renfort || stock === undefined || prix_htva === undefined
    ) {
      res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
      return;
    }

    // Création du produit avec status par défaut à true
    const produit = await Produit.create({
      saison,
      marque,
      modele,
      largeur_pneu,
      profil_pneu,
      type_pneu,
      diametre,
      indice_charge,
      indice_vitesse,
      renfort,
      stock,
      prix_htva,
      image: image || null, // Permet d'avoir un champ image null par défaut si non fourni
      status: true, // Défini automatiquement sur true
    });

    res.status(201).json({ message: "Produit ajouté avec succès", produit });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const modifierProduit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      saison,
      marque,
      modele,
      largeur_pneu,
      profil_pneu,
      type_pneu,
      diametre,
      indice_charge,
      indice_vitesse,
      renfort,
      stock,
      prix_htva,
      image,
      status, // Optionnel, pas obligatoire à taper
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

    // Mise à jour des propriétés du produit, sans obliger à entrer `status`
    const updatedProduit = await produit.update({
      saison: saison || produit.saison,
      marque: marque || produit.marque,
      modele: modele || produit.modele,
      largeur_pneu: largeur_pneu || produit.largeur_pneu,
      profil_pneu: profil_pneu || produit.profil_pneu,
      type_pneu: type_pneu || produit.type_pneu,
      diametre: diametre || produit.diametre,
      indice_charge: indice_charge || produit.indice_charge,
      indice_vitesse: indice_vitesse || produit.indice_vitesse,
      renfort: renfort || produit.renfort,
      stock: stock !== undefined ? stock : produit.stock,
      prix_htva: prix_htva !== undefined ? prix_htva : produit.prix_htva,
      image: image || produit.image,
      status: status !== undefined ? status : produit.status, // Conserve l'ancien status si non fourni
    });

    res.status(200).json({ message: "Produit modifié avec succès", produit: updatedProduit });
  } catch (error) {
    console.error("Erreur lors de la modification du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const modifierStatusProduit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est valide
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

    // Inversion du statut
    produit.status = !produit.status;

    // Mise à jour dans la base de données
    await produit.save();

    res.status(200).json({ message: "Statut du produit mis à jour avec succès", produit });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const afficherAllTrueProduit = async (req: Request, res: Response) => {
  try {
    const produitsActifs = await Produit.findAll({
      where: { status: true },
    });

    res.status(200).json(produitsActifs);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits actifs:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const afficherProduit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est valide
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

    res.status(200).json({ message: "Produit récupéré avec succès", produit });
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const afficherAllProduit = async (req: Request, res: Response) => {
  try {
    const tousLesProduits = await Produit.findAll();

    res.status(200).json(tousLesProduits);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export async function getStocks(req: Request, res: Response): Promise<void> {
  try {
    console.log("Récupération des stocks des produits...");
    // Récupérer les stocks des produits avec les attributs spécifiés
    const stocks = await Produit.findAll({
      attributes: [
        'id',
        'saison',
        'marque',
        'modele',
        'largeur_pneu',
        'profil_pneu',
        'diametre',
        'stock'
      ],
      order: [['modele', 'ASC']], 
    });

  
    res.status(200).json({
      message: "Stocks récupérés avec succès.",
      data: stocks,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stocks :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

export async function searchProduit(req: Request, res: Response) { 
  try {
      const { id, saison, marque, reference } = req.query;

      let query = `
      SELECT id, saison, marque, modele, largeur_pneu, profil_pneu, diametre, prix_htva, stock, status
      FROM produits
      WHERE 
      (COALESCE(:id, id) = id) 
      AND (COALESCE(:saison, saison) = saison) 
      AND (COALESCE(:marque, marque) = marque)
      `;

      const replacements: any = {
          id: id ? Number(id) : null,
          saison: saison || null,
          marque: marque || null,
      };

      // Si la référence (225/45/16) est fournie, on l'extrait et on adapte la requête
      if (reference) {
          const regex = /^(\d{3})\/(\d{2})\/(\d{2})$/;
          const match = typeof reference === 'string' ? reference.match(regex) : null;
          
          if (match) {
              const [_, largeur_pneu, profil_pneu, diametre] = match;
              query += ` AND largeur_pneu = :largeur_pneu AND profil_pneu = :profil_pneu AND diametre = :diametre`;
              replacements.largeur_pneu = Number(largeur_pneu);
              replacements.profil_pneu = Number(profil_pneu);
              replacements.diametre = Number(diametre);
          } else {
              res.status(400).json({ message: "Format de référence invalide. Utiliser '225/45/16'." });
              return;
          }
      }

      query += ` ORDER BY modele ASC;`;

      // Exécution sécurisée avec Sequelize
      const produits = await sequelize.query(query, {
          replacements,
          type: "SELECT",
          raw: true
      });

      res.json(produits);
  } catch (error: any) {
      console.error("Erreur lors de la recherche des produits:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
