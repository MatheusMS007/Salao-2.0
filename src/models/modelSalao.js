import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'
import Usuarios from './modelUsuario.js'

const Saloes = sequelize.define('Salao', {

    idSalao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false // nome do salão
    }
},
{
    tableName: 'saloes',
    timestamps: false,
    charset: 'utf8'
})

// um usuário dono tem um salão
Usuarios.hasOne(Saloes, { foreignKey: 'idUsuario' })
Saloes.belongsTo(Usuarios, { foreignKey: 'idUsuario' })

export default Saloes
