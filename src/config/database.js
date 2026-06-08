import sequelize from './orm.js' // importa a conexão que criamos no orm.js

// Função que executa qualquer comando no banco de dados
const execute = async (sql, params) => { // sql = o comando, params = os valores do comando
    const options = {}                   // cria um objeto vazio de opções
    if (params) options.replacements = params // se tiver valores, adiciona nas opções
    return await sequelize.query(sql, options) // executa o comando no banco e retorna o resultado
}

export default { execute } // exporta a função para poder usar em outros arquivos
