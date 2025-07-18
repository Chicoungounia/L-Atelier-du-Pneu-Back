import { Request, Response } from "express";
import Client from "../models/clientModel";
import { ValidationError } from "sequelize";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import sequelize from "../config/database";

export const ajouterClient = [verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const { nom, prenom, adresse, email, telephone, type } = req.body;

    // Vérification des données requises
    if (!nom || !type) {
      res.status(400).json({ message: "Nom et type sont requis." });
      return;
    }

    // Création du client avec statut par défaut "Actif" si non fourni
    const client = await Client.create({
      nom,
      prenom,
      adresse,
      email,
      telephone,
      type,
    });

    res.status(201).json({ message: "Client ajouté avec succès", client });
    return;

  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.errors.map(err => err.message) });
      return;
    }

    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}];

export const modifierClient = [verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, prenom, adresse, email, telephone, type } = req.body;

    // Vérifier que l'ID est valide
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Vérifier qu'au moins un champ est fourni pour la modification
    if (!nom && !prenom && !adresse && !email && !telephone && !type) {
      res.status(400).json({ message: "Au moins un champ doit être renseigné pour la modification." });
      return;
    }

    // Vérifier si le client existe
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ message: "Client non trouvé" });
      return;
    }

    // Mise à jour du client sans modifier le statut
    await client.update({
      nom,
      prenom,
      adresse,
      email,
      telephone,
      type,
    }, {
      fields: ['nom', 'prenom', 'adresse', 'email', 'telephone', 'type'] // Exclure le champ `status`
    });

    res.status(200).json({ message: "Client modifié avec succès", client });
    return;

  } catch (error) {
    console.error("Erreur lors de la modification du client:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.errors.map(err => err.message) });
      return;
    }

    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}];

export const modifierStatusClient = [verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Vérifier que l'ID est valide
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Vérifier que le statut est bien "Actif" ou "Inactif"
    if (!status || !["Actif", "Inactif"].includes(status)) {
      res.status(400).json({ message: "Statut invalide. Valeurs autorisées: 'Actif' ou 'Inactif'." });
      return;
    }

    // Vérifier si le client existe
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ message: "Client non trouvé" });
      return;
    }

    // Mise à jour du statut uniquement
    await client.update({ status });

    res.status(200).json({ message: "Statut du client modifié avec succès", client });
    return;

  } catch (error) {
    console.error("Erreur lors de la modification du statut du client:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.errors.map(err => err.message) });
      return;
    }

    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}];

export const afficherClientsActifs = [verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll({
      where: { status: "Actif" }
    });

    res.status(200).json({ message: "Liste des clients actifs récupérée avec succès", clients });
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients actifs:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}];

export const afficherAllClients = [verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json({ message: "Liste des clients récupérée avec succès", clients });
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}];

export const afficherUnClient = [verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est valide
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    // Recherche du client par ID
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ message: "Client non trouvé" });
      return;
    }

    res.status(200).json({ message: "Client récupéré avec succès", client });
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}];

export async function searchClient(req: Request, res: Response, next: unknown) {
  try {
    const { id, nom, prenom, email, telephone, type } = req.query;

    // Construction de la requête SQL dynamique
    const query = `
      SELECT id, nom, prenom, email, telephone, type
      FROM clients
      WHERE
      (:id IS NULL OR id = :id) AND
      (:nom IS NULL OR nom ILIKE :nom) AND
      (:prenom IS NULL OR prenom ILIKE :prenom) AND
      (:email IS NULL OR email ILIKE :email) AND
      (:telephone IS NULL OR telephone ILIKE :telephone) AND
      (:type IS NULL OR type = :type)
      ORDER BY nom ASC;
    `;

    // Création des valeurs à remplacer dans la requête
    const replacements: any = {
      id: id ? Number(id) : null,
      nom: nom ? `%${nom}%` : null, // Recherche partielle sur le nom
      prenom: prenom ? `%${prenom}%` : null, // Recherche partielle sur le prénom
      email: email ? `%${email}%` : null, // Recherche partielle sur l'email
      telephone: telephone ? `%${telephone}%` : null, // Recherche partielle sur le téléphone
      type: type || null, // "Privé" ou "Professionnel"
    };

    console.log("Requête SQL générée :", query);
    console.log("Valeurs des paramètres :", replacements);

    // Exécution sécurisée avec Sequelize
    const clients = await sequelize.query(query, {
      replacements,
      type: "SELECT",
      raw: true,
    });

    // Répondre avec les clients trouvés
    res.json(clients);
  } catch (error: any) {
    console.error("Erreur lors de la recherche :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

