import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/JWTUtils';

// ✅ Étendre Request pour inclure `user`
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.cookies?.jwt; // ✅ Correction : Utilisation correcte du cookie

        if (!token) {
            res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
            return;
        }

        const decoded = verifyToken(token); // ✅ Vérification du token

        if (!decoded) {
            res.status(403).json({ message: 'Token invalide ou expiré' });
            return;
        }

        req.user = decoded; // ✅ Stockage sécurisé des infos utilisateur
        next();
    } catch (error) {
        console.error("❌ Erreur de vérification du token :", error);
        res.status(401).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource' });
    }
}
