import bdConexao from '../config/database.js' // importa a conexão com o banco de dados

// CADASTRAR um novo agendamento
export const criarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body // pega os dados enviados pelo formulário

    if (!idCliente || !servico || !data || !hora) { // verifica se todos os campos foram preenchidos
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    const sql = 'INSERT INTO agendamentos (idCliente, servico, data, hora, status) VALUES (?, ?, ?, ?, ?)' // comando para inserir no banco
    try {
        await bdConexao.execute(sql, [idCliente, servico, data, hora, 'pendente']) // status começa sempre como 'pendente'
        res.redirect('/agendamentos')                                               // redireciona para a lista de agendamentos
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// LISTAR todos os agendamentos (com o nome do cliente junto)
export const listarAgendamentos = async (req, res) => {
    // JOIN une as duas tabelas para mostrar o nome do cliente junto com o agendamento
    const sql = `SELECT agendamentos.*, clientes.nome AS nomeCliente 
                 FROM agendamentos 
                 JOIN clientes ON agendamentos.idCliente = clientes.idCliente
                 ORDER BY data, hora` // ordena por data e hora
    try {
        const [agendamentos] = await bdConexao.execute(sql) // executa e guarda o resultado
        res.render('agendamentos', { agendamentos })        // mostra a página com a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EDITAR um agendamento
export const atualizarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body // pega os novos dados do formulário
    const id = req.params.id                            // pega o id do agendamento que está na URL

    const sql = 'UPDATE agendamentos SET idCliente = ?, servico = ?, data = ?, hora = ? WHERE idAgendamento = ?' // comando para atualizar
    try {
        await bdConexao.execute(sql, [idCliente, servico, data, hora, id]) // executa com os novos dados
        res.redirect('/agendamentos')                                       // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MARCAR um agendamento como REALIZADO
export const marcarRealizado = async (req, res) => {
    const id = req.params.id // pega o id do agendamento que está na URL

    const sql = 'UPDATE agendamentos SET status = ? WHERE idAgendamento = ?' // comando para atualizar só o status
    try {
        await bdConexao.execute(sql, ['realizado', id]) // muda o status para 'realizado'
        res.redirect('/agendamentos')                   // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// APAGAR um agendamento
export const removerAgendamento = async (req, res) => {
    const id = req.params.id

    const sql = 'DELETE FROM agendamentos WHERE idAgendamento = ?'
    try {
        await bdConexao.execute(sql, [id])
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MOSTRAR a página de cadastro de agendamento (formulário em branco)
export const exibirCadastroAgendamento = async (req, res) => {
    const sql = 'SELECT * FROM clientes ORDER BY nome'
    try {
        const [clientes] = await bdConexao.execute(sql)
        res.render('cadastroAgendamento', { clientes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MOSTRAR a página de edição de agendamento (formulário já preenchido)
export const exibirEdicaoAgendamento = async (req, res) => {
    const id = req.params.id

    const sqlAgendamento = 'SELECT * FROM agendamentos WHERE idAgendamento = ?' // busca o agendamento pelo id
    const sqlClientes = 'SELECT * FROM clientes ORDER BY nome'                  // busca todos os clientes para o select
    try {
        const [rows] = await bdConexao.execute(sqlAgendamento, [id])
        const [clientes] = await bdConexao.execute(sqlClientes)
        const agendamento = rows[0]                                             // pega o primeiro resultado
        res.render('editarAgendamento', { agendamento, clientes })              // abre a página já preenchida
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
