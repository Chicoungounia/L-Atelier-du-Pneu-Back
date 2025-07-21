import { 
    ajouterRendezVous, 
    modifierRendezVous, 
    deleteRendezVous, 
    afficherRendezVous, 
    afficherAllRendezVous, 
    afficherAllRendezVousReserver, 
    afficherAllRendezVousClient,
    searchRendezVous
} from "../controllers/rendezVousController";
import RendezVous from "../models/rendezVousModel";
import { User } from "../models/userModels";
import sequelize from "../config/database";
import moment from "moment-timezone";

// Mock console.error et console.log pour éviter les sorties dans les tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe("RendezVous Controller", () => {
    let req: any;
    let res: any;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = { params: {}, body: {}, query: {} };
        res = { status: statusMock, json: jsonMock };
        
        // Mock des méthodes Sequelize
        jest.spyOn(RendezVous, 'create').mockImplementation();
        jest.spyOn(RendezVous, 'findByPk').mockImplementation();
        jest.spyOn(RendezVous, 'findAll').mockImplementation();
        jest.spyOn(RendezVous, 'findOne').mockImplementation();
        jest.spyOn(User, 'findByPk').mockImplementation();
        jest.spyOn(sequelize, 'query').mockImplementation();
        
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

    describe("Ajouter un rendez-vous", () => {
        const rendezVousComplet = {
            clientId: 1,
            userId: 2,
            pont: 1,
            dateDebut: "2025-04-01T08:00:00.000Z",
            dateFin: "2025-04-01T09:00:00.000Z",
            status: "Réserver",
            timeZone: "Europe/Brussels"
        };

        it("devrait retourner une erreur 400 si des champs obligatoires sont manquants", async () => {
            req.body = { clientId: 1, userId: 2 }; // Champs manquants
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Tous les champs requis doivent être fournis." 
            });
        });

        it("devrait retourner une erreur 400 si l'utilisateur n'est pas un ouvrier", async () => {
            req.body = rendezVousComplet;
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Admin" });
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "L'utilisateur doit avoir le rôle 'Ouvrier'." 
            });
        });

        it("devrait retourner une erreur 400 si la date de début est dans le passé", async () => {
            // Date d'hier
            const hier = new Date();
            hier.setDate(hier.getDate() - 1);
            
            req.body = {
                ...rendezVousComplet,
                dateDebut: hier.toISOString(),
                dateFin: new Date(hier.getTime() + 60 * 60 * 1000).toISOString() // 1 heure plus tard
            };
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Impossible de créer un rendez-vous pour une date passée." 
            });
        });

        it("devrait retourner une erreur 400 pour un rendez-vous le dimanche", async () => {
            // Date d'un dimanche dans le futur
            const dimancheFutur = new Date();
            dimancheFutur.setDate(dimancheFutur.getDate() + (7 - dimancheFutur.getDay())); // Prochain dimanche
            dimancheFutur.setHours(10, 0, 0, 0); // 10h00
            
            req.body = {
                ...rendezVousComplet,
                dateDebut: dimancheFutur.toISOString(),
                dateFin: new Date(dimancheFutur.getTime() + 60 * 60 * 1000).toISOString()
            };
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Aucun rendez-vous n'est autorisé le dimanche." 
            });
        });

        it("devrait retourner une erreur 400 pour un rendez-vous en dehors des heures d'ouverture", async () => {
            // Date de demain à 6h30 (avant 7h00)
            const demain = new Date();
            demain.setDate(demain.getDate() + 1);
            demain.setHours(6, 30, 0, 0);
            
            req.body = {
                ...rendezVousComplet,
                dateDebut: demain.toISOString(),
                dateFin: new Date(demain.getTime() + 60 * 60 * 1000).toISOString()
            };
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Les rendez-vous doivent être pris entre 7h00 et 19h00." 
            });
        });

        it("devrait retourner une erreur 400 pour un rendez-vous après 19h", async () => {
            // Date de demain à 19h30 (après 19h00)
            const demain = new Date();
            demain.setDate(demain.getDate() + 1);
            demain.setHours(19, 30, 0, 0);
            
            req.body = {
                ...rendezVousComplet,
                dateDebut: demain.toISOString(),
                dateFin: new Date(demain.getTime() + 60 * 60 * 1000).toISOString()
            };
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Les rendez-vous doivent être pris entre 7h00 et 19h00." 
            });
        });

        it("devrait créer un rendez-vous avec succès", async () => {
            // Date de demain à 8h00 (heure valide)
            const demain = new Date();
            demain.setDate(demain.getDate() + 1);
            demain.setHours(8, 0, 0, 0);
            
            const mockRendezVous = {
                id: 1,
                clientId: 1,
                userId: 2,
                pont: 1,
                dateDebut: demain,
                dateFin: new Date(demain.getTime() + 60 * 60 * 1000),
                status: "Réserver",
                timeZone: "Europe/Brussels"
            };
            
            req.body = {
                ...rendezVousComplet,
                dateDebut: demain.toISOString(),
                dateFin: new Date(demain.getTime() + 60 * 60 * 1000).toISOString()
            };
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            (RendezVous.findOne as jest.Mock).mockResolvedValue(null); // Pas de conflit
            (RendezVous.create as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await ajouterRendezVous(req, res);
            
            expect(RendezVous.create).toHaveBeenCalledWith(expect.objectContaining({
                clientId: 1,
                userId: 2,
                pont: 1,
                status: "Réserver",
                timeZone: "Europe/Brussels"
            }));
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Rendez-vous ajouté avec succès",
                rendezVous: mockRendezVous
            });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            req.body = rendezVousComplet;
            (User.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await ajouterRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Modifier un rendez-vous", () => {
        it("devrait retourner une erreur 400 si la date de début est dans le passé", async () => {
            // Date d'hier
            const hier = new Date();
            hier.setDate(hier.getDate() - 1);
            
            const rendezVousModifie = {
                clientId: 1,
                userId: 2,
                pont: 2,
                dateDebut: hier.toISOString(),
                dateFin: new Date(hier.getTime() + 60 * 60 * 1000).toISOString(),
                status: "Réserver",
                timeZone: "Europe/Brussels"
            };

            const mockRendezVous = {
                id: 1,
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            req.body = rendezVousModifie;
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(mockRendezVous);
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            
            await modifierRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Impossible de modifier un rendez-vous pour une date passée." 
            });
        });

        it("devrait modifier un rendez-vous avec succès", async () => {
            // Date de demain à 10h00 (heure valide)
            const demain = new Date();
            demain.setDate(demain.getDate() + 1);
            demain.setHours(10, 0, 0, 0);
            
            const rendezVousModifie = {
                clientId: 1,
                userId: 2,
                pont: 2,
                dateDebut: demain.toISOString(),
                dateFin: new Date(demain.getTime() + 60 * 60 * 1000).toISOString(),
                status: "Réserver",
                timeZone: "Europe/Brussels"
            };

            const mockRendezVous = {
                id: 1,
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            req.body = rendezVousModifie;
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(mockRendezVous);
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 2, role: "Ouvrier" });
            (RendezVous.findOne as jest.Mock).mockResolvedValue(null); // Pas de conflit
            
            await modifierRendezVous(req, res);
            
            expect(mockRendezVous.update).toHaveBeenCalledWith(expect.objectContaining({
                clientId: 1,
                userId: 2,
                pont: 2,
                status: "Réserver",
                timeZone: "Europe/Brussels"
            }));
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Rendez-vous modifié avec succès",
                rendezVous: mockRendezVous
            });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            // Date de demain à 10h00 (heure valide)
            const demain = new Date();
            demain.setDate(demain.getDate() + 1);
            demain.setHours(10, 0, 0, 0);
            
            const rendezVousModifie = {
                clientId: 1,
                userId: 2,
                pont: 2,
                dateDebut: demain.toISOString(),
                dateFin: new Date(demain.getTime() + 60 * 60 * 1000).toISOString(),
                status: "Réserver",
                timeZone: "Europe/Brussels"
            };

            req.params = { id: "1" };
            req.body = rendezVousModifie;
            (RendezVous.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await modifierRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Supprimer un rendez-vous", () => {
        it("devrait retourner une erreur 404 si le rendez-vous n'existe pas", async () => {
            req.params = { id: "999" };
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(null);
            
            await deleteRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Rendez-vous non trouvé." });
        });

        it("devrait supprimer un rendez-vous avec succès", async () => {
            const mockRendezVous = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await deleteRendezVous(req, res);
            
            expect(mockRendezVous.destroy).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Rendez-vous supprimé avec succès." });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            req.params = { id: "1" };
            (RendezVous.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await deleteRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher un rendez-vous", () => {
        it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
            req.params = { id: "invalid" };
            
            await afficherRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID du rendez-vous invalide." });
        });

        it("devrait retourner une erreur 404 si le rendez-vous n'existe pas", async () => {
            req.params = { id: "999" };
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(null);
            
            await afficherRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Rendez-vous non trouvé." });
        });

        it("devrait retourner le rendez-vous avec succès", async () => {
            const mockRendezVous = {
                id: 1,
                clientId: 1,
                userId: 2,
                pont: 1,
                dateDebut: "2025-04-01T08:00:00.000Z",
                dateFin: "2025-04-01T09:00:00.000Z",
                status: "Réserver"
            };
            
            req.params = { id: "1" };
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await afficherRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Rendez-vous récupéré avec succès",
                rendezVous: mockRendezVous
            });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            req.params = { id: "1" };
            (RendezVous.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher tous les rendez-vous", () => {
        it("devrait retourner tous les rendez-vous", async () => {
            const mockRendezVous = [
                { id: 1, clientId: 1, userId: 2, pont: 1, status: "Réserver" },
                { id: 2, clientId: 2, userId: 3, pont: 2, status: "Effectuer" }
            ];
            
            (RendezVous.findAll as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await afficherAllRendezVous(req, res);
            
            expect(RendezVous.findAll).toHaveBeenCalledWith();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockRendezVous);
        });

        it("devrait gérer les erreurs du serveur", async () => {
            (RendezVous.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherAllRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher les rendez-vous réservés", () => {
        it("devrait retourner les rendez-vous avec le statut 'Réserver'", async () => {
            const mockRendezVous = [
                { id: 1, clientId: 1, userId: 2, pont: 1, status: "Réserver" },
                { id: 2, clientId: 2, userId: 3, pont: 2, status: "Réserver" }
            ];
            
            (RendezVous.findAll as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await afficherAllRendezVousReserver(req, res);
            
            expect(RendezVous.findAll).toHaveBeenCalledWith({
                where: { status: "Réserver" }
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockRendezVous);
        });

        it("devrait gérer les erreurs du serveur", async () => {
            (RendezVous.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherAllRendezVousReserver(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher les rendez-vous d'un client", () => {
        it("devrait retourner une erreur 400 si l'ID client est invalide", async () => {
            req.params = { clientId: "invalid" };
            
            await afficherAllRendezVousClient(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID client invalide." });
        });

        it("devrait retourner les rendez-vous du client", async () => {
            const mockRendezVous = [
                { id: 1, clientId: 1, userId: 2, pont: 1, status: "Réserver" },
                { id: 2, clientId: 1, userId: 3, pont: 2, status: "Effectuer" }
            ];
            
            req.params = { clientId: "1" };
            (RendezVous.findAll as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await afficherAllRendezVousClient(req, res);
            
            expect(RendezVous.findAll).toHaveBeenCalledWith({
                where: { clientId: "1" }
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockRendezVous);
        });

        it("devrait gérer les erreurs du serveur", async () => {
            req.params = { clientId: "1" };
            (RendezVous.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherAllRendezVousClient(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Rechercher des rendez-vous", () => {
        it("devrait effectuer une recherche avec des paramètres", async () => {
            const mockRendezVous = [
                { id: 1, clientId: 1, userId: 2, dateDebut: "2025-04-01T08:00:00.000Z", dateFin: "2025-04-01T09:00:00.000Z", status: "Réserver" }
            ];
            
            req.query = { clientId: "1", userId: "2" };
            (sequelize.query as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await searchRendezVous(req, res);
            
            expect(sequelize.query).toHaveBeenCalledWith(
                expect.stringContaining("SELECT id, \"clientId\", \"userId\", \"dateDebut\", \"dateFin\", status"),
                expect.objectContaining({
                    replacements: expect.objectContaining({
                        clientId: 1,
                        userId: 2
                    }),
                    type: "SELECT",
                    raw: true
                })
            );
            expect(jsonMock).toHaveBeenCalledWith(mockRendezVous);
        });

        it("devrait effectuer une recherche sans paramètres", async () => {
            const mockRendezVous: any[] = [];
            
            req.query = {};
            (sequelize.query as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await searchRendezVous(req, res);
            
            expect(sequelize.query).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    replacements: expect.objectContaining({
                        id: null,
                        clientId: null,
                        userId: null
                    })
                })
            );
            expect(jsonMock).toHaveBeenCalledWith(mockRendezVous);
        });

        it("devrait gérer les erreurs de recherche", async () => {
            req.query = { clientId: "1" };
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await searchRendezVous(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Une erreur est survenue lors de la récupération des rendez-vous." 
            });
        });
    });
});
