import Joi from "joi";

// Schéma pour l'inscription d'un utilisateur
export const registerSchema = Joi.object({
    nom: Joi.string().min(2).max(30).required()
    .messages({
    'string.empty': 'Le nom est requis.',
    'string.min': 'Le nom doit contenir au moins 2 caractères.',
    'string.max': 'Le nom ne peut pas dépasser 30 caractères.'
    }),
    prenom: Joi.string().min(2).max(30).required()
    .messages({
        'string.empty': 'Le prenom est requis.',
        'string.min': 'Le nom doit contenir au moins 2 caractères.',
        'string.max': 'Le nom ne peut pas dépasser 30 caractères.'
        }),
    email: Joi.string().email().required()
    .messages({
        'string.empty': 'L\'email est requis1.',
        'string.email': 'L\'email doit être valide.'
        }),
    password: Joi.string().min(3)
    // .pattern(/^(?=.*[!@#$%^&+*])(?=.*\d)/)
    .required()
    .messages({
        'string.empty' : 'Le mot de passe est requis.' ,
        'string.min': 'Le mot de passe doit contenir au moins 3 caractères.' ,
        // 'string.pattern.base' : 'Le mot de passe doit contenir au moins un chiffre et un caractère spécial.'
}),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required()
    .messages({
        'string.empty': 'L\'email est requis.',
        'string.email': 'L\'email doit être valide.'
    }),
    password: Joi.string().required()
    .messages({
        'string.empty': 'Le mot de passe est requis.'
    })
});

// Schéma pour la modification du mot de passe
export const updatePasswordSchema = Joi.object({
    ancienPassword: Joi.string().required()
    .messages({
        'string.empty': 'L\'ancien mot de passe est requis.'
    }),
    nouveauPassword: Joi.string().min(3).required()
    .messages({
        'string.empty': 'Le nouveau mot de passe est requis.',
        'string.min': 'Le nouveau mot de passe doit contenir au moins 3 caractères.'
    })
});



   

 