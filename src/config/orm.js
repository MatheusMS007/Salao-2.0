import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

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

const conexaoBD = async () => {
    try {
        await sequelize.authenticate()
        console.log('Banco de dados conectado com sucesso!')
    } catch (error) {
        console.error('Erro ao conectar no banco de dados:', error)
    }
}

conexaoBD()

export const sincronizarBD = async () => {
    try {
        await import('../models/modelUsuario.js')
        await import('../models/modelSalao.js')
        await import('../models/modelCliente.js')
        await import('../models/modelAgendamento.js')
        await import('../models/modelSolicitacao.js')
        await sequelize.sync({ force: false })
        console.log('Tabelas sincronizadas com sucesso!')
    } catch (error) {
        console.error('Erro ao sincronizar tabelas:', error)
    }
}

export default sequelize
