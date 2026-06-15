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
        allowNull: false,
        unique: true
    }
},
{
    tableName: 'saloes',
    timestamps: false,
    charset: 'utf8'
})

Saloes.hasMany(Usuarios, { foreignKey: 'idSalao' })
Usuarios.belongsTo(Saloes, { foreignKey: 'idSalao' })

export default Saloes
