import bcryptjs from 'bcryptjs';

//nombre plus haut plus hasher mais plus lent
const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
    //utilisation de bcrypt
    return bcryptjs.hash(password, saltRounds);
}
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
}