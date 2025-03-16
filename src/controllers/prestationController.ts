import { Request, Response } from "express";
import Prestation from "../models/prestationModels";



export const ajouterPrestation = async (req: Request, res: Response) => {
  try {
    const { travail, description, prix } = req.body;

    // Vérification que toutes les données sont présentes
    if (!travail || !description || prix === undefined) {
      res.status(400).json({ message: "Tous les champs sont obligatoires." });
      return;
    }

    // Création de la prestation
    const nouvellePrestation = await Prestation.create({ travail, description, prix });
    res.status(201).json(nouvellePrestation);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la prestation", error });
  }
};

export const modifierPrestation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { travail, description, prix } = req.body;
  
      // Vérification que la prestation existe
      const prestation = await Prestation.findByPk(id);
      if (!prestation) {
        res.status(404).json({ message: "Prestation non trouvée." });
        return;
      }
  
      // Création d'un objet contenant uniquement les champs fournis
      const updateData: Partial<{ travail: string; description: string; prix: number }> = {};
      if (travail !== undefined) updateData.travail = travail;
      if (description !== undefined) updateData.description = description;
      if (prix !== undefined) updateData.prix = prix;
  
      // Mise à jour de la prestation avec les champs fournis
      await prestation.update(updateData);
  
      res.status(200).json(prestation);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la modification de la prestation", error });
    }
  };
  
  
  export const deletePrestation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Vérification que la prestation existe
      const prestation = await Prestation.findByPk(id);
      if (!prestation) {
        res.status(404).json({ message: "Prestation non trouvée." });
        return;
      }
  
      // Suppression de la prestation
      await prestation.destroy();
  
      res.status(200).json({ message: "Prestation supprimée avec succès." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de la prestation", error });
    }
  };
