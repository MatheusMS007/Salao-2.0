import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config() // carrega o .env antes de qualquer coisa

let sequelize

if(process.env.MODE_NODE === 'dev') {
    console.log('Modo: ', process.env.MODE_NODE)
    sequelize = new Sequelize({  // cria a conexão com o banco de dados
    dialect: 'sqlite',
    storage: './src/database/salao.db'
})
}else {
    console.log('Modo: ', process.env.MODE_NODE)
    sequelize = new Sequelize(
        process.env.DATABASE_URL,
        {
            dialect: 'postgres',
            dialectOptions: { 
                ssl: { require: true, rejectUnauthorized: false }
            },
            logging: false
        }
    )
}

// Função que testa se a conexão com o banco de dados funcionou
const conexaoBD = async () => {
    try {
        await sequelize.authenticate()                           // tenta conectar
        console.log('Banco de dados conectado com sucesso!')     // se funcionou, mostra no terminal
    } catch (error) {
        console.error('Erro ao conectar no banco de dados:', error) // se deu erro, mostra o erro
    }
}

conexaoBD() // chama a função acima para testar a conexão quando o sistema iniciar

// Função que cria as tabelas no banco de dados com base nos modelos
export const sincronizarBD = async () => {
    try {
        // importa os models aqui para garantir que estão registrados antes de sincronizar
        await import('../models/modelUsuario.js')
        await import('../models/modelSalao.js')
        await import('../models/modelCliente.js')
        await import('../models/modelAgendamento.js')
        await import('../models/modelSolicitacao.js')
        await sequelize.sync({ force: false }) // altera as tabelas para coincidir com os modelos sem apagar dados ***
        console.log('Tabelas sincronizadas com sucesso!')
    } catch (error) {
        console.error('Erro ao sincronizar tabelas:', error)
    }
}

export default sequelize // exporta a conexão para poder usar em outros arquivos
