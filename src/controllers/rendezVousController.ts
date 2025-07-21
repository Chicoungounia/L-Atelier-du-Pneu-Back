import { Op } from "sequelize";
import { Request, Response } from "express";
import RendezVous from "../models/rendezVousModel";
import { User } from "../models/userModels";
import sequelize from "../config/database";
import moment from "moment-timezone";

export const ajouterRendezVous = async (req: Request, res: Response) => {
    try {
        const { clientId, userId, pont, dateDebut, dateFin, status, timeZone } = req.body;

        if (!clientId || !userId || !pont || !dateDebut || !dateFin || !timeZone) {
            res.status(400).json({ message: "Tous les champs requis doivent être fournis." });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user || user.role !== "Ouvrier") {
            res.status(400).json({ message: "L'utilisateur doit avoir le rôle 'Ouvrier'." });
            return;
        }

        const dateDebutObj = moment.tz(dateDebut, timeZone).toDate();
        const dateFinObj = moment.tz(dateFin, timeZone).toDate();

        if (isNaN(dateDebutObj.getTime()) || isNaN(dateFinObj.getTime())) {
            res.status(400).json({ message: "Format de date invalide." });
            return;
        }

        // Vérification que la date de début n'est pas dans le passé
        const maintenant = new Date();
        if (dateDebutObj < maintenant) {
            res.status(400).json({ message: "Impossible de créer un rendez-vous pour une date passée." });
            return;
        }

        const jour = dateDebutObj.getDay();
        if (jour === 0) {
            res.status(400).json({ message: "Aucun rendez-vous n'est autorisé le dimanche." });
            return;
        }

        const heureRdv = dateDebutObj.getHours() * 60 + dateDebutObj.getMinutes();
        if (heureRdv < 7 * 60 || heureRdv >= 19 * 60) {
            res.status(400).json({ message: "Les rendez-vous doivent être pris entre 7h00 et 19h00." });
            return;
        }

        const pontExist = await RendezVous.findOne({
            where: {
                pont,
                dateDebut: { [Op.lt]: dateFinObj },
                dateFin: { [Op.gt]: dateDebutObj },
            },
        });

        if (pontExist) {
            res.status(400).json({ message: `Le pont ${pont} est déjà réservé à cette heure.` });
            return;
        }

        const ouvrierExist = await RendezVous.findOne({
            where: {
                userId,
                dateDebut: { [Op.lt]: dateFinObj },
                dateFin: { [Op.gt]: dateDebutObj },
            },
        });

        if (ouvrierExist) {
            res.status(400).json({ message: "L'ouvrier est déjà occupé à cette heure." });
            return;
        }

        const rendezVous = await RendezVous.create({
            clientId,
            userId,
            pont,
            dateDebut: dateDebutObj,
            dateFin: dateFinObj,
            status: status || "Réserver",
            timeZone, // Stocker le fuseau horaire-S
        });

        res.status(201).json({ message: "Rendez-vous ajouté avec succès", rendezVous });
    } catch (error) {
        console.error("Erreur lors de l'ajout du rendez-vous:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const modifierRendezVous = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { clientId, userId, pont, dateDebut, dateFin, status, timeZone } = req.body;

        const rendezVous = await RendezVous.findByPk(id);
        if (!rendezVous) {
            res.status(404).json({ message: "Rendez-vous non trouvé." });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user || user.role !== "Ouvrier") {
            res.status(400).json({ message: "L'utilisateur doit avoir le rôle 'Ouvrier'." });
            return;
        }

        const dateDebutObj = moment.tz(dateDebut, timeZone).toDate();
        const dateFinObj = moment.tz(dateFin, timeZone).toDate();

        // Vérification que la date de début n'est pas dans le passé
        const maintenant = new Date();
        if (dateDebutObj < maintenant) {
            res.status(400).json({ message: "Impossible de modifier un rendez-vous pour une date passée." });
            return;
        }

        const jour = dateDebutObj.getDay();
        if (jour === 0) {
            res.status(400).json({ message: "Aucun rendez-vous n'est autorisé le dimanche." });
            return;
        }

        const heureRdv = dateDebutObj.getHours() * 60 + dateDebutObj.getMinutes();
        if (heureRdv < 7 * 60 || heureRdv >= 19 * 60) {
            res.status(400).json({ message: "Les rendez-vous doivent être pris entre 7h00 et 19h00." });
            return;
        }

        const pontExist = await RendezVous.findOne({
            where: {
                pont,
                dateDebut: { [Op.lt]: dateFinObj },
                dateFin: { [Op.gt]: dateDebutObj },
                id: { [Op.ne]: id },
            },
        });

        if (pontExist) {
            res.status(400).json({ message: `Le pont ${pont} est déjà réservé à cette heure.` });
            return;
        }

        const ouvrierExist = await RendezVous.findOne({
            where: {
                userId,
                dateDebut: { [Op.lt]: dateFinObj },
                dateFin: { [Op.gt]: dateDebutObj },
                id: { [Op.ne]: id },
            },
        });

        if (ouvrierExist) {
            res.status(400).json({ message: "L'ouvrier est déjà occupé à cette heure." });
            return;
        }

        await rendezVous.update({
            clientId,
            userId,
            pont,
            dateDebut: dateDebutObj,
            dateFin: dateFinObj,
            status,
            timeZone, // Mettre à jour le fuseau horaire
        });

        res.status(200).json({ message: "Rendez-vous modifié avec succès", rendezVous });
    } catch (error) {
        console.error("Erreur lors de la modification du rendez-vous:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const deleteRendezVous = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const rendezVous = await RendezVous.findByPk(id);
        if (!rendezVous) {
            res.status(404).json({ message: "Rendez-vous non trouvé." });
            return;
        }

        await rendezVous.destroy();
        res.status(200).json({ message: "Rendez-vous supprimé avec succès." });
        return;
    } catch (error) {
        console.error("Erreur lors de la suppression du rendez-vous:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
        return;
    }
};

export const afficherRendezVous = async (req: Request, res: Response) => {
    try {
        console.log("mauvais controplleur")
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: "ID du rendez-vous invalide." });
            return;
        }

        const rendezVous = await RendezVous.findByPk(id);

        if (!rendezVous) {
            res.status(404).json({ message: "Rendez-vous non trouvé." });
            return;
        }

        res.status(200).json({ message: "Rendez-vous récupéré avec succès", rendezVous });
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération du rendez-vous:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
        return;
    }
};

export const afficherAllRendezVous = async (req: Request, res: Response) => {
    try {
      const rendezVous = await RendezVous.findAll();
      res.status(200).json(rendezVous);
      return;
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
      return;
    }
  };
  
  export const afficherAllRendezVousReserver = async (req: Request, res: Response) => {
    try {
      const rendezVousReserves = await RendezVous.findAll({
        where: { status: "Réserver" },
      });
      res.status(200).json(rendezVousReserves);
      return;
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous réservés:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
      return;
    }
  };
  
  export const afficherAllRendezVousClient = async (req: Request, res: Response) => {
    try {
      const { clientId } = req.params;
  
      if (!clientId || isNaN(Number(clientId))) {
        res.status(400).json({ message: "ID client invalide." });
        return;
      }
  
      const rendezVousClient = await RendezVous.findAll({
        where: { clientId },
      });
  
      res.status(200).json(rendezVousClient);
      return;
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous du client:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
      return;
    }
  };

  export async function searchRendezVous(req: Request, res: Response) {
    try {
        const { id, clientId, userId } = req.query;

        // Requête SQL sans filtre sur dateDebut et dateFin, avec affichage du status
        const query = `
        SELECT id, "clientId", "userId", "dateDebut", "dateFin", status
        FROM rendezvous
        WHERE
        (:id IS NULL OR id = :id) AND
        (:clientId IS NULL OR "clientId" = :clientId) AND
        (:userId IS NULL OR "userId" = :userId)
        ORDER BY "dateDebut" ASC;
        `;

        // Exécution sécurisée avec les valeurs des paramètres
        const rendezVous = await sequelize.query(query, {
            replacements: {
                id: id ? Number(id) : null,
                clientId: clientId ? Number(clientId) : null,
                userId: userId ? Number(userId) : null,
            },
            type: "SELECT",
            raw: true
        });

        res.json(rendezVous);
    } catch (error: any) {
        console.error("Erreur lors de la recherche des rendez-vous :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des rendez-vous." });
    }
}

