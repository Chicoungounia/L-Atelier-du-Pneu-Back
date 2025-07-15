import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY: string | undefined = process.env.JWT_KEY;  

if (!SECRET_KEY) {
    throw new Error('JWT_KEY n\'est pas définie');
}

export function generateToken(payload: JwtPayload): string {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined');
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1000h' });
}

export function verifyToken(token: string): string | JwtPayload | null {
    try {
        if (!SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined');
        }
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        // Loguer l'erreur pour mieux la comprendre
        console.error('Erreur lors de la vérification du token :', error);
        return null;
    }
}
