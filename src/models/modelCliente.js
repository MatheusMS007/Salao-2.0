import { DataTypes } from 'sequelize'  // importa os tipos de dados (texto, número, etc)
import sequelize from '../config/orm.js' // importa a conexão com o banco de dados

// Define a tabela de clientes no banco de dados
const Clientes = sequelize.define('Cliente', { // 'Cliente' é o nome do modelo

    idCliente: {
        type: DataTypes.INTEGER,  // tipo número inteiro
        primaryKey: true,         // é a chave principal
        autoIncrement: true,      // atualiza automatico
        allowNull: false          // não pode ficar vazio
    },
    nome: {
        type: DataTypes.STRING,   // tipo texto
        allowNull: false          // não pode ficar vazio
    },
    telefone: {
        type: DataTypes.STRING,   // tipo texto
        allowNull: false          // não pode ficar vazio
    },
    email: {
        type: DataTypes.STRING,   // tipo texto
        allowNull: true           // pode ficar vazio, email é opcional
    },
    idSalao: {
        type: DataTypes.INTEGER,  // chave estrangeira que liga o cliente ao salão
        allowNull: false
    }
},
{
    tableName: 'clientes', // nome da tabela no banco de dados
    timestamps: false,     // não cria colunas de data de criação/atualização automaticamente
    charset: 'utf8'        // aceita acentos e caracteres especiais
})

export default Clientes 
