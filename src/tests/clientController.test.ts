// import dotenv from "dotenv";
// dotenv.config();

// import { ajouterClient, modifierClient, modifierStatusClient, afficherClientsActifs, afficherAllClients, afficherUnClient, searchClient } from "../controllers/clientController";
// import sequelize from "../config/database";
// import Client from "../models/clientModel";
// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

// // Mock de `Client` et `sequelize`
// jest.mock("../models/clientModel", () => ({
//     create: jest.fn(),
//     findByPk: jest.fn(),
//     findAll: jest.fn(),
//     update: jest.fn(),
// }));

// jest.mock("../config/database", () => ({
//     query: jest.fn(),
// }));

// // Mock de la fonction de génération de token JWT
// jest.mock('jsonwebtoken', () => ({
//     sign: jest.fn(),
//     verify: jest.fn(),
// }));

// describe("ClientController", () => {

//     let req: Request;
//     let res: Response;
//     let statusMock: jest.Mock;
//     let jsonMock: jest.Mock;
//     let nextMock: NextFunction; // Correct type for NextFunction
//     const mockToken = "mockedJWTToken"; // Un token factice pour tester

//     beforeEach(() => {
//         statusMock = jest.fn().mockReturnThis();
//         jsonMock = jest.fn();
//         nextMock = jest.fn();
//         req = { body: {}, params: {}, query: {}, headers: { authorization: `Bearer ${mockToken}` } } as Request; // On ajoute un token JWT dans les headers
//         res = { status: statusMock, json: jsonMock } as unknown as Response;
//         jest.clearAllMocks();
//     });

//     describe("ajouterClient", () => {
//         it("devrait retourner une erreur 400 si le nom ou le type est manquant", async () => {
//             req.body = { nom: "Test" }; // `type` manquant
//             await ajouterClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(400);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Nom et type sont requis." });
//         });

//         it("devrait ajouter un client avec succès et retourner 201", async () => {
//             req.body = { nom: "Test", type: "Privé" };
//             (Client.create as jest.Mock).mockResolvedValue({
//                 id: 1,
//                 nom: "Test",
//                 type: "Privé",
//             });
//             await ajouterClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(201);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Client ajouté avec succès", client: expect.objectContaining({ nom: "Test" }) });
//         });

//         it("devrait retourner une erreur 500 si une erreur de serveur survient", async () => {
//             req.body = { nom: "Test", type: "Privé" };
//             (Client.create as jest.Mock).mockRejectedValue(new Error("Erreur interne"));
//             await ajouterClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(500);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
//         });
//     });

//     describe("modifierClient", () => {
//         it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
//             req.params.id = "invalid";
//             await modifierClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(400);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
//         });

//         it("devrait retourner une erreur 404 si le client n'existe pas", async () => {
//             req.params.id = "1";
//             req.body = { nom: "Test" };
//             (Client.findByPk as jest.Mock).mockResolvedValue(null);
//             await modifierClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(404);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Client non trouvé" });
//         });

//         it("devrait modifier un client avec succès et retourner 200", async () => {
//             req.params.id = "1";
//             req.body = { nom: "Test" };

//             const clientMock = {
//                 id: 1,
//                 nom: "Old Name",
//                 update: jest.fn().mockResolvedValue([1]) // mock de la mise à jour qui retourne un tableau avec 1 pour simuler une mise à jour réussie
//             };

//             (Client.findByPk as jest.Mock).mockResolvedValue(clientMock);
            
//             await modifierClient[1](req, res, nextMock); // Ajout du `nextMock`
            
//             expect(statusMock).toHaveBeenCalledWith(200);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Client modifié avec succès", client: expect.objectContaining({ nom: "Test" }) });
//         });
//     });

//     describe("modifierStatusClient", () => {
//         it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
//             req.params.id = "invalid";
//             req.body.status = "Actif";
//             await modifierStatusClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(400);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
//         });

//         it("devrait retourner une erreur 404 si le client n'existe pas", async () => {
//             req.params.id = "1";
//             req.body.status = "Actif";
//             (Client.findByPk as jest.Mock).mockResolvedValue(null);
//             await modifierStatusClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(404);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Client non trouvé" });
//         });

//         it("devrait retourner une erreur 400 si le statut est invalide", async () => {
//             req.params.id = "1";
//             req.body.status = "InvalidStatus";
//             await modifierStatusClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(400);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Statut invalide. Valeurs autorisées: 'Actif' ou 'Inactif'." });
//         });

//         it("devrait modifier le statut du client avec succès et retourner 200", async () => {
//             req.params.id = "1";
//             req.body.status = "Inactif";
//             (Client.findByPk as jest.Mock).mockResolvedValue({
//                 id: 1,
//                 status: "Actif",
//                 update: jest.fn()
//             });
//             await modifierStatusClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(200);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Statut du client modifié avec succès", client: expect.objectContaining({ status: "Inactif" }) });
//         });
//     });

//     describe("afficherClientsActifs", () => {
//         it("devrait retourner une liste des clients actifs et un statut 200", async () => {
//             const clientsMock = [{ id: 1, nom: "Test", status: "Actif" }];
//             (Client.findAll as jest.Mock).mockResolvedValue(clientsMock);
//             await afficherClientsActifs[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(200);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Liste des clients actifs récupérée avec succès", clients: clientsMock });
//         });

//         it("devrait retourner une erreur 500 si une erreur de serveur survient", async () => {
//             (Client.findAll as jest.Mock).mockRejectedValue(new Error("Erreur serveur"));
//             await afficherClientsActifs[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(500);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
//         });
//     });

//     describe("afficherAllClients", () => {
//         it("devrait retourner tous les clients et un statut 200", async () => {
//             const clientsMock = [{ id: 1, nom: "Test" }];
//             (Client.findAll as jest.Mock).mockResolvedValue(clientsMock);
//             await afficherAllClients[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(200);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Liste des clients récupérée avec succès", clients: clientsMock });
//         });
//     });

//     describe("afficherUnClient", () => {
//         it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
//             req.params.id = "invalid";
//             await afficherUnClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(400);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
//         });

//         it("devrait retourner une erreur 404 si le client n'existe pas", async () => {
//             req.params.id = "1";
//             (Client.findByPk as jest.Mock).mockResolvedValue(null);
//             await afficherUnClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(404);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Client non trouvé" });
//         });

//         it("devrait afficher un client avec succès et un statut 200", async () => {
//             req.params.id = "1";
//             const clientMock = { id: 1, nom: "Test" };
//             (Client.findByPk as jest.Mock).mockResolvedValue(clientMock);
//             await afficherUnClient[1](req, res, nextMock); // Ajout du `nextMock`
//             expect(statusMock).toHaveBeenCalledWith(200);
//             expect(jsonMock).toHaveBeenCalledWith({ message: "Client récupéré avec succès", client: clientMock });
//         });
//     });

//     describe("searchClient", () => {
//         it("devrait retourner des résultats de recherche", async () => {
//             req.query = { nom: "Test" };
//             const clientsMock = [{ id: 1, nom: "Test", prenom: "User" }];
            
//             // On utilise jest.fn() pour créer un mock de la fonction `next`
//             const nextMock = jest.fn();
    
//             // Mock de la fonction sequelize.query
//             (sequelize.query as jest.Mock).mockResolvedValue(clientsMock);
    
//             // Appel de la fonction à tester
//             await searchClient(req, res, nextMock);
    
//             // Vérifier que le mock de `next` n'a pas été appelé, car la réponse a été envoyée
//             expect(nextMock).not.toHaveBeenCalled();
    
//             // Vérifier que la réponse a bien été envoyée avec les bons résultats
//             expect(jsonMock).toHaveBeenCalledWith(clientsMock);
//         });
//     });
// });
