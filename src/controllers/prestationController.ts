import { Request, Response } from "express";
import Prestation from "../models/prestationModels";



export const ajouterPrestation = async (req: Request, res: Response) => {
  try {
    const { travail, description, prix_htva } = req.body;

    // Vérification que toutes les données sont présentes
    if (!travail || !description || prix_htva === undefined) {
      res.status(400).json({ message: "Tous les champs sont obligatoires." });
      return;
    }

    // Création de la prestation
    const nouvellePrestation = await Prestation.create({ travail, description, prix_htva });
    res.status(201).json(nouvellePrestation);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la prestation", error });
  }
};

export const modifierPrestation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { travail, description, prix_htva, status } = req.body;

    // Vérification que la prestation existe
    const prestation = await Prestation.findByPk(id);
    if (!prestation) {
      res.status(404).json({ message: "Prestation non trouvée." });
      return;
    }

    // Création d'un objet contenant uniquement les champs fournis
    const updateData: Partial<{ travail: string; description: string; prix_htva: number; status: boolean }> = {};
    if (travail !== undefined) updateData.travail = travail;
    if (description !== undefined) updateData.description = description;
    if (prix_htva !== undefined) updateData.prix_htva = prix_htva;
    if (status !== undefined) updateData.status = status;

    // Mise à jour de la prestation avec les champs fournis
    await prestation.update(updateData);

    res.status(200).json(prestation);
    return;
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification de la prestation", error });
    return;
  }
};

export const modifierStatusPrestation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est valide
    if (isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Recherche de la prestation par ID
    const prestation = await Prestation.findByPk(id);

    if (!prestation) {
      res.status(404).json({ message: "Prestation non trouvée" });
      return;
    }

    // Inversion du statut
    prestation.status = !prestation.status;

    // Sauvegarde de la modification en base de données
    await prestation.save();

    res.status(200).json({ message: "Statut de la prestation mis à jour avec succès", prestation });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la prestation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const afficherPrestation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérification que l'ID est valide
    if (isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Recherche de la prestation par ID
    const prestation = await Prestation.findByPk(id);

    if (!prestation) {
      res.status(404).json({ message: "Prestation non trouvée" });
      return;
    }

    res.status(200).json({ message: "Prestation récupérée avec succès", prestation });
  } catch (error) {
    console.error("Erreur lors de la récupération de la prestation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


export const afficherStatusAllTruePrestation = async (req: Request, res: Response) => {
  try {
    const prestationsActives = await Prestation.findAll({
      where: { status: true },
    });

    res.status(200).json(prestationsActives);
    return;
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des prestations actives", error });
    return;
  }
};
  
  
 


  export const afficherAllPrestations = async (req: Request, res: Response) => {
    try {
      const prestations = await Prestation.findAll();
      res.status(200).json(prestations);
      return;
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des prestations", error });
      return;
    }
  };
  
