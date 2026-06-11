import Clientes from '../models/modelCliente.js'
import Agendamentos from '../models/modelAgendamento.js'

// CADASTRAR um novo cliente
export const criarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body // pega os dados enviados pelo formulário

    if (!nome || !telefone) { // verifica se nome e telefone foram preenchidos
        return res.status(400).json({ mensagem: 'Nome e telefone são obrigatórios!' })
    }

    try {
        await Clientes.create({ nome, telefone, email })
        res.redirect('/clientes') // redireciona para a lista de clientes
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// LISTAR todos os clientes
export const listarClientes = async (req, res) => {
    try {
        const clientes = await Clientes.findAll({ order: [['nome', 'ASC']] })
        res.render('clientes', { clientes }) // mostra a página com a lista de clientes
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EDITAR um cliente
export const atualizarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body // pega os novos dados do formulário
    const id = req.params.id                   // pega o id do cliente que está na URL

    try {
        await Clientes.update(
            { nome, telefone, email },
            { where: { idCliente: id } }
        )
        res.redirect('/clientes') // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// APAGAR um cliente
export const removerCliente = async (req, res) => {
    const id = req.params.id // pega o id do cliente que está na URL

    try {
        const agendamentos = await Agendamentos.count({ where: { idCliente: id } })
        if (agendamentos > 0) { // se tiver, bloqueia a exclusão
            return res.status(400).json({ mensagem: 'Não é possível apagar um cliente com agendamentos cadastrados!' })
        }
        await Clientes.destroy({ where: { idCliente: id } }) // apaga o cliente
        res.redirect('/clientes') // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MOSTRAR a página de cadastro de cliente (formulário em branco)
export const exibirCadastroCliente = (req, res) => {
    res.render('cadastroCliente') // abre a página de cadastro
}

// MOSTRAR a página de edição de cliente (formulário já preenchido)
export const exibirEdicaoCliente = async (req, res) => {
    const id = req.params.id // pega o id do cliente que está na URL

    try {
        const cliente = await Clientes.findByPk(id)
        res.render('editarCliente', { cliente }) // abre a página já preenchida com os dados
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

