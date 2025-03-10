import { DataTypes , Model , Optional } from "sequelize" ;
import sequelize from "../config/database" ;


interface UtilisateurAttributes {
 id?: number ;
 nom: string ;
 email : string ;
 createdAt ?: Date ;
 updatedAt ?: Date ;
}

class Utilisateur extends Model <UtilisateurAttributes >
 implements UtilisateurAttributes {
 public id!: number ;
 public nom!: string ;
 public email !: string ;
 public readonly createdAt !: Date ;
 public readonly updatedAt !: Date ;
}
Utilisateur .init (
 {
 id: {
 type : DataTypes .INTEGER ,
 autoIncrement: true ,
 primaryKey: true ,
 },

 nom: {
 type : DataTypes .STRING ,
 allowNull: false ,
 },
 
 email: {
 type : DataTypes .STRING ,
 allowNull: false ,
 unique: true ,
 validate: {
 isEmail: true ,
 },
 },
 },
 {
 
 sequelize ,
 tableName: "utilisateurs" ,
 timestamps: true , 
 }
);

export default Utilisateur; 