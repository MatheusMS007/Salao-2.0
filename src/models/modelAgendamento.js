import { DataTypes } from 'sequelize'   // importa os tipos de dados (texto, número, etc)
import sequelize from '../config/orm.js'  // importa a conexão com o banco de dados
import Clientes from './modelCliente.js'  // importa o model de clientes para fazer a ligação

// Define a tabela de agendamentos no banco de dados
const Agendamentos = sequelize.define('Agendamento', { // 'Agendamento' é o nome do modelo

    idAgendamento: {
        type: DataTypes.INTEGER,  // tipo número inteiro
        primaryKey: true,         // é a chave primária
        autoIncrement: true,      // atualiza automatico 
        allowNull: false          // não pode ficar vazio
    },
    servico: {
        type: DataTypes.STRING,   // tipo texto
        allowNull: false          // não pode ficar vazio
    },
    data: {
        type: DataTypes.DATEONLY, // tipo data (apenas data, sem hora)
        allowNull: false          // não pode ficar vazio
    },
    hora: {
        type: DataTypes.TIME,     // tipo hora
        allowNull: false          // não pode ficar vazio
    },
    status: {
        type: DataTypes.STRING,   // tipo texto
        allowNull: false,         // não pode ficar vazio
        defaultValue: 'pendente'  // quando criar um agendamento, o status começa como 'pendente'
    },
    idSalao: {
        type: DataTypes.INTEGER,  // chave estrangeira que liga o agendamento ao salão
        allowNull: false
    }
},
{
    tableName: 'agendamentos', // nome da tabela no banco de dados
    timestamps: false,         // não cria colunas de data automáticas
    charset: 'utf8'            // aceita acentos 
})

// Liga a tabela de agendamentos com a tabela de clientes
// Um cliente pode ter vários agendamentos
Clientes.hasMany(Agendamentos, { foreignKey: 'idCliente' })   // um cliente tem muitos agendamentos
Agendamentos.belongsTo(Clientes, { foreignKey: 'idCliente' }) // um agendamento pertence a um cliente

export default Agendamentos // exporta o model
