import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API L'Atelier du Pneu",
      version: "1.0.0",
      description: "Documentation de l’API Express.js avec Swagger",
    },
    servers: [
      {
        url: process.env.API_URL, // URL de l'API définie dans .env
      },
    ],
    components: {
      schemas: {
        Authentification: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID unique de l'utilisateur" },
            nom: { type: "string", example: "Dupont", description: "Nom de l'utilisateur" },
            prenom: { type: "string", example: "Jean", description: "Prénom de l'utilisateur" },
            speudo: { type: "string", example: "jdupont", description: "Pseudonyme de l'utilisateur" },
            email: { type: "string", format: "email", example: "jean.dupont@example.com", description: "Adresse e-mail de l'utilisateur" },
            role: { 
              type: "string", 
              enum: ["Admin", "Ouvrier", "Employé"], 
              example: "Employé", 
              description: "Rôle de l'utilisateur dans le système"
            },
            hashedpassword: { 
              type: "string", 
              example: "$2b$10$N9qo8uLOickgx2ZMRZo5i.eiZyBjh.qUj9AOk3Wgm5n6kvoGZl5.u",
              description: "Mot de passe hashé de l'utilisateur"
            },
            status: { 
              type: "string", 
              enum: ["Actif", "Inactif"], 
              example: "Actif", 
              description: "Statut de l'utilisateur"
            },
            createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:20:30Z", description: "Date et heure de création" },
            updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:20:30Z", description: "Date et heure de la dernière mise à jour" },
          },
        },
        Utilisateurs: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID unique de l'utilisateur" },
            nom: { type: "string", example: "Dupont", description: "Nom de l'utilisateur" },
            prenom: { type: "string", example: "Jean", description: "Prénom de l'utilisateur" },
            speudo: { type: "string", example: "jdupont", description: "Pseudonyme de l'utilisateur" },
            email: { type: "string", format: "email", example: "jean.dupont@example.com", description: "Adresse e-mail de l'utilisateur" },
            role: { 
              type: "string", 
              enum: ["Admin", "Ouvrier", "Employé"], 
              example: "Employé", 
              description: "Rôle de l'utilisateur dans le système"
            },
            status: { 
              type: "string", 
              enum: ["Actif", "Inactif"], 
              example: "Actif", 
              description: "Statut de l'utilisateur"
            },
            createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:20:30Z", description: "Date et heure de création" },
            updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:20:30Z", description: "Date et heure de la dernière mise à jour" },
          },
        },
        Prestations: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID unique de la prestation" },
            travail: { type: "string", example: "Montage de pneus", description: "Type de prestation" },
            description: { type: "string", example: "Montage de quatre pneus neufs sur jantes.", description: "Description détaillée de la prestation" },
            prix: { type: "number", format: "float", example: 50.00, description: "Prix de la prestation" },
            createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:20:30Z", description: "Date et heure de création" },
            updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:20:30Z", description: "Date et heure de la dernière mise à jour" },
          },
        },
        Rendez_Vous: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID unique du rendez-vous" },
            clientId: { type: "integer", example: 1, description: "ID du client associé" },
            userId: { type: "integer", example: 2, description: "ID de l'ouvrier affecté" },
            pont: { type: "integer", example: 3, description: "Numéro du pont utilisé" },
            dateDebut: { type: "string", format: "date-time", example: "2025-03-16T09:00:00Z", description: "Date et heure de début" },
            dateFin: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z", description: "Date et heure de fin" },
            status: { type: "string", enum: ["Confirmé", "Annulé", "En attente"], example: "Confirmé", description: "Statut du rendez-vous" },
          },
        },
      },
    },
  },
  apis: ["./dist/routes/*.{js,ts}", "./src/routes/*.{ts,js}"], // Chemins des fichiers avec annotations Swagger
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
