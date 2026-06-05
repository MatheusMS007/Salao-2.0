import bdConexao from '../config/database.js' // importa a conexão com o banco de dados

// CADASTRAR um novo cliente
export const criarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body // pega os dados enviados pelo formulário

    if (!nome || !telefone) { // verifica se nome e telefone foram preenchidos
        return res.status(400).json({ mensagem: 'Nome e telefone são obrigatórios!' })
    }

    const sql = 'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)' // comando para inserir no banco
    try {
        await bdConexao.execute(sql, [nome, telefone, email]) // executa o comando com os dados
        res.redirect('/clientes')                             // redireciona para a lista de clientes
    } catch (err) {
        res.status(500).json({ erro: err.message }) // se der erro, mostra a mensagem
    }
}

// LISTAR todos os clientes
export const listarClientes = async (req, res) => {
    const sql = 'SELECT * FROM clientes ORDER BY nome' // comando para buscar todos os clientes em ordem alfabética
    try {
        const [clientes] = await bdConexao.execute(sql) // executa e guarda o resultado
        res.render('clientes', { clientes })            // mostra a página com a lista de clientes
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
}

// EDITAR um cliente
export const atualizarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body // pega os novos dados do formulário
    const id = req.params.id                   // pega o id do cliente que está na URL

    const sql = 'UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE idCliente = ?' // comando para atualizar
    try {
        await bdConexao.execute(sql, [nome, telefone, email, id]) // executa com os novos dados
        res.redirect('/clientes')                                  // volta para a lista
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
}

// APAGAR um cliente
export const removerCliente = async (req, res) => {
    const id = req.params.id // pega o id do cliente que está na URL

    const sql = 'DELETE FROM clientes WHERE idCliente = ?' // comando para apagar
    try {
        await bdConexao.execute(sql, [id]) // executa o comando
        res.redirect('/clientes')          // volta para a lista
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
}

// MOSTRAR a página de cadastro de cliente (formulário em branco)
export const exibirCadastroCliente = (req, res) => {
    res.render('cadastroCliente') // abre a página de cadastro
}

// MOSTRAR a página de edição de cliente (formulário já preenchido)
export const exibirEdicaoCliente = async (req, res) => {
    const id = req.params.id // pega o id do cliente que está na URL

    const sql = 'SELECT * FROM clientes WHERE idCliente = ?' // busca o cliente pelo id
    try {
        const [rows] = await bdConexao.execute(sql, [id])
        const cliente = rows[0]                   // pega o primeiro resultado
        res.render('editarCliente', { cliente })  // abre a página já preenchida com os dados
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
}

