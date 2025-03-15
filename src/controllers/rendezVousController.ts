import { Op } from "sequelize";
import { Request, Response } from "express";
import RendezVous from "../models/rendezVousModel"; // Modèle RendezVous
import { User } from "../models/userModels"; // Modèle User

export const ajouterRendezVous = async (req: Request, res: Response) => {
    try {
        const { clientId, userId, pont, dateHeure, heureFin, status } = req.body;

        // Vérification des champs obligatoires
        if (!clientId || !userId || !pont || !dateHeure || !heureFin) {
            res.status(400).json({ message: "Tous les champs requis doivent être fournis." });
            return;
        }

        // Vérifier si l'utilisateur est un Ouvrier
        const user = await User.findByPk(userId);
        if (!user || user.role !== "Ouvrier") {
            res.status(400).json({ message: "L'utilisateur doit avoir le rôle 'Ouvrier'." });
            return;
        }

        const dateDebut = new Date(dateHeure);
        const dateFin = new Date(heureFin);

        // Vérification que le jour est bien entre lundi et samedi (0 = dimanche)
        const jour = dateDebut.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
        if (jour === 0) {
            res.status(400).json({ message: "Aucun rendez-vous n'est autorisé le dimanche." });
            return;
        }

        // Vérification que l'heure du rendez-vous est entre 7h00 et 19h00
        const heure = dateDebut.getHours();
        const minutes = dateDebut.getMinutes();
        const heureRdv = heure * 60 + minutes; // Heure en minutes

        const heureDebutJournee = 7 * 60; // 07:00 en minutes
        const heureFinJournee = 19 * 60;  // 19:00 en minutes

        if (heureRdv < heureDebutJournee || heureRdv >= heureFinJournee) {
            res.status(400).json({ message: "Les rendez-vous doivent être pris entre 7h00 et 19h00." });
            return;
        }

        // Vérification de la disponibilité du pont (pas de chevauchement de rendez-vous)
        const pontExist = await RendezVous.findOne({
            where: {
                pont, // Vérifier si le pont est déjà réservé à cette heure
                dateDebut: {
                    [Op.lt]: dateFin, // Si le rendez-vous commence avant la fin du créneau
                },
                dateFin: {
                    [Op.gt]: dateDebut, // Si le rendez-vous finit après le début du créneau
                },
            },
        });

        if (pontExist) {
            res.status(400).json({ message: `Le pont ${pont} est déjà réservé à cette heure.` });
            return;
        }

        // Vérification de la disponibilité de l'ouvrier (pas de chevauchement de rendez-vous avec le même ouvrier)
        const ouvrierExist = await RendezVous.findOne({
            where: {
                userId, // Vérifier si l'ouvrier est déjà réservé à cette heure
                dateDebut: {
                    [Op.lt]: dateFin, // Si le rendez-vous commence avant la fin du créneau
                },
                dateFin: {
                    [Op.gt]: dateDebut, // Si le rendez-vous finit après le début du créneau
                },
            },
        });

        if (ouvrierExist) {
            res.status(401).json({ message: `L'ouvrier est déjà occupé à cette heure.` });
            return;
        }

        // Créer le rendez-vous dans la base de données
        const rendezVous = await RendezVous.create({
            clientId,
            userId,  // Remplacez `ouvrierId` par `userId`
            pont, // Le pont sur lequel le rendez-vous est pris
            dateDebut,  // dateHeure
            dateFin,    // heureFin
            status: status || "réserver", // Si aucun status n'est fourni, utiliser "réserver" par défaut
        });

        res.status(201).json({ message: "Rendez-vous ajouté avec succès", rendezVous });
        return;
    } catch (error) {
        console.error("Erreur lors de l'ajout du rendez-vous:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
        return;
    }
};





// export const modifierRendezVous = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { clientId, ouvrierId, dateHeure, status } = req.body;

//         const rendezVous = await RendezVous.findByPk(id);
//         if (!rendezVous) {
//             res.status(404).json({ message: "Rendez-vous non trouvé" });
//             return;
//         }

//         await rendezVous.update({ clientId, ouvrierId, dateHeure, status });

//         res.status(200).json({ message: "Rendez-vous modifié avec succès", rendezVous });
//         return;
//     } catch (error) {
//         console.error("Erreur lors de la modification du rendez-vous:", error);
//         res.status(500).json({ message: "Erreur interne du serveur" });
//         return;
//     }
// };


// export const supprimerRendezVous = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const rendezVous = await RendezVous.findByPk(id);
//         if (!rendezVous) {
//             res.status(404).json({ message: "Rendez-vous non trouvé" });
//             return;
//         }

//         await rendezVous.destroy();

//         res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
//         return;
//     } catch (error) {
//         console.error("Erreur lors de la suppression du rendez-vous:", error);
//         res.status(500).json({ message: "Erreur interne du serveur" });
//         return;
//     }
// };

// // Obtenir tous les rendez-vous
// export const obtenirTousLesRendezVous = async (req: Request, res: Response) => {
//     try {
//         const rendezVous = await RendezVous.findAll({
//             include: [
//                 { model: Client, attributes: ["id", "nom", "prenom", "email"] },
//                 { model: User, attributes: ["id", "nom", "prenom", "email"] },
//             ],
//         });

//         res.status(200).json(rendezVous);
//         return;
//     } catch (error) {
//         console.error("Erreur lors de la récupération des rendez-vous:", error);
//         res.status(500).json({ message: "Erreur interne du serveur" });
//         return;
//     }
// };

// // Obtenir un rendez-vous par ID
// export const obtenirRendezVousParId = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const rendezVous = await RendezVous.findByPk(id, {
//             include: [
//                 { model: Client, attributes: ["id", "nom", "prenom", "email"] },
//                 { model: User, attributes: ["id", "nom", "prenom", "email"] },
//             ],
//         });

//         if (!rendezVous) {
//             res.status(404).json({ message: "Rendez-vous non trouvé" });
//             return;
//         }

//         res.status(200).json(rendezVous);
//         return;
//     } catch (error) {
//         console.error("Erreur lors de la récupération du rendez-vous:", error);
//         res.status(500).json({ message: "Erreur interne du serveur" });
//         return;
//     }
// };
