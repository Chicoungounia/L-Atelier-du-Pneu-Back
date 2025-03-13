import { Request, Response } from "express";
import RendezVous from "../models/rendezVousModel";
import Client from "../models/clientModel";
import { User } from "../models/userModels";


export const ajouterRendezVous = async (req: Request, res: Response) => {
    try {
        const { clientId, ouvrierId, dateHeure, heureFin, status } = req.body;

        if (!clientId || !ouvrierId || !dateHeure || !heureFin) {
            res.status(400).json({ message: "Tous les champs requis doivent être fournis." });
            return;
        }

        const dateDebut = new Date(dateHeure);
        const dateFin = new Date(heureFin);

        // Vérification des horaires d'ouverture
        const jour = dateDebut.getDay(); // 1 = Lundi, 5 = Vendredi
        const heure = dateDebut.getHours();
        const minutes = dateDebut.getMinutes();

        const heureDebutMatin = 9 * 60; // 09:00 en minutes
        const heureFinMatin = 12 * 60 + 30; // 12:30 en minutes
        const heureDebutApresMidi = 13 * 60 + 30; // 13:30 en minutes
        const heureFinSoir = 19 * 60; // 19:00 en minutes

        const heureRdv = heure * 60 + minutes;

        if (
            jour < 1 || jour > 5 || // Week-end
            !(
                (heureRdv >= heureDebutMatin && heureRdv < heureFinMatin) ||
                (heureRdv >= heureDebutApresMidi && heureRdv < heureFinSoir)
            )
        ) {
            res.status(400).json({ message: "Rendez-vous en dehors des heures d'ouverture." });
            return;
        }

        const rendezVous = await RendezVous.create({
            clientId,
            ouvrierId,
            dateHeure,
            heureFin,
            status: status || "Actif",
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
