import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'
import Clientes from './modelCliente.js'

const Agendamentos = sequelize.define('Agendamento', {

    idAgendamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        type: DataTypes.ENUM('pendente', 'realizado'),
        allowNull: false,
        defaultValue: 'pendente'
    },
    idSalao: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    tableName: 'agendamentos',
    timestamps: false
})

Clientes.hasMany(Agendamentos, { foreignKey: 'idCliente' })
Agendamentos.belongsTo(Clientes, { foreignKey: 'idCliente' })

export default Agendamentos
