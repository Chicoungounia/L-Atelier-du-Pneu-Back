import { Request, Response } from "express";
import Client from "../models/clientModel";
import { ValidationError } from "sequelize";

export const ajouterClient = async (req: Request, res: Response) => {
  try {
    const { nom, prenom, adresse, email, telephone, status } = req.body;

    // Vérification des données requises
    if (!nom || !status) {
      res.status(400).json({ message: "Nom et status sont requis." });
      return;
    }

    // Création du client
    const client = await Client.create({
      nom,
      prenom,
      adresse,
      email,
      telephone,
      status,
    });

    res.status(201).json({ message: "Client ajouté avec succès", client });
    return;

  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};


export const modifierClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Récupérer l'ID depuis l'URL
      const { nom, prenom, adresse, email, telephone, status } = req.body;
  
      // Vérifier que l'ID est bien passé et est un nombre
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: "ID invalide" });
        return 
      }
  
      // Vérifier si le client existe
      const client = await Client.findByPk(id);
      if (!client) {
        res.status(404).json({ message: "Client non trouvé" });
        return 
      }
  

  
      // Mise à jour du client
      await client.update({
        nom,
        prenom,
        adresse,
        email,
        telephone,
        status,
      });
  
      res.status(200).json({ message: "Client modifié avec succès", client });
      return 

  
    } catch (error) {
      console.error("Erreur lors de la modification du client:", error);
  
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.errors.map(err => err.message) });
        return 
      }
  
      res.status(500).json({ message: "Erreur interne du serveur" });
      return 
    }
  };

  export const deleteClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Vérification que l'ID est un nombre valide
      if (isNaN(Number(id))) {
        res.status(400).json({ message: "ID invalide" });
        return;
      }
  
      // Recherche du client par ID
      const client = await Client.findByPk(id);
  
      if (!client) {
        res.status(404).json({ message: "Client non trouvé" });
        return;
      }
  
      // Suppression du client
      await client.destroy();
  
      res.status(200).json({ message: "Client supprimé avec succès" });
      return;

    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
      return;
    }
  };
  