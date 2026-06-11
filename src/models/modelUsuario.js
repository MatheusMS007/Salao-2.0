import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'

const Usuarios = sequelize.define('Usuario', {

    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // não pode ter dois usuários com o mesmo email
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false // vai guardar o hash da senha
    },
    perfil: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'dono' // perfil padrão é dono de salão
    },
    idSalao: {
        type: DataTypes.INTEGER,
        allowNull: true, // ADM não precisa ter salão; somente donos usam esse campo
        references: {
            model: 'saloes',
            key: 'idSalao'
        }
    }
},
{
    tableName: 'usuarios',
    timestamps: false,
    charset: 'utf8'
})

export default Usuarios
