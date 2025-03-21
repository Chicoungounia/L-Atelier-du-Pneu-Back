import { Op } from "sequelize";
import { Request, Response } from "express";
import RendezVous from "../models/rendezVousModel";
import { User } from "../models/userModels";

export const ajouterRendezVous = async (req: Request, res: Response) => {
    try {
        const { clientId, userId, pont, dateDebut, dateFin, status } = req.body;

        if (!clientId || !userId || !pont || !dateDebut || !dateFin) {
            res.status(400).json({ message: "Tous les champs requis doivent être fournis." });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user || user.role !== "Ouvrier") {
            res.status(400).json({ message: "L'utilisateur doit avoir le rôle 'Ouvrier'." });
            return;
        }

        const dateDebutObj = new Date(dateDebut);
        const dateFinObj = new Date(dateFin);

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
            status: status || "réserver",
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
        const { clientId, userId, pont, dateDebut, dateFin, status } = req.body;

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

        const dateDebutObj = new Date(dateDebut);
        const dateFinObj = new Date(dateFin);

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
    } catch (error) {
        console.error("Erreur lors de la suppression du rendez-vous:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
