import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'
import Saloes from './modelSalao.js'

const Solicitacoes = sequelize.define('Solicitacao', {

    idSolicitacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[\d\s\(\)\-\+]+$/
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    servico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendente', 'confirmado', 'recusado'),
        allowNull: false,
        defaultValue: 'pendente'
    },
    idSalao: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    tableName: 'solicitacoes',
    timestamps: false
})

// um salão pode ter várias solicitações
Saloes.hasMany(Solicitacoes, { foreignKey: 'idSalao' })
Solicitacoes.belongsTo(Saloes, { foreignKey: 'idSalao' })

export default Solicitacoes
