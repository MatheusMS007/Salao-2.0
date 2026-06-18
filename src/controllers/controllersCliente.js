import Clientes from '../models/modelCliente.js'
import Agendamentos from '../models/modelAgendamento.js'

export const criarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body
    const idSalao = req.session.usuario.idSalao

    if (!nome || !telefone) {
        return res.status(400).json({ mensagem: 'Nome e telefone são obrigatórios!' })
    }

    if (!idSalao) {
        return res.status(400).render('erro', { mensagem: 'Usuário não tem um salão associado!' })
    }

    try {
        await Clientes.create({ nome, telefone, email, idSalao })
        res.redirect('/clientes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const listarClientes = async (req, res) => {
    const idSalao = req.session.usuario.idSalao

    try {
        const clientes = await Clientes.findAll({
            where: { idSalao },
            order: [['nome', 'ASC']]
        })
        res.render('clientes', { clientes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const atualizarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const cliente = await Clientes.findOne({ where: { idCliente: id, idSalao } })

        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        await Clientes.update(
            { nome, telefone, email },
            { where: { idCliente: id, idSalao } }
        )
        res.redirect('/clientes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const removerCliente = async (req, res) => {
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const cliente = await Clientes.findOne({ where: { idCliente: id, idSalao } })

        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        const agendamentos = await Agendamentos.count({ where: { idCliente: id } })
        if (agendamentos > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um cliente com agendamentos cadastrados!' })
        }

        await Clientes.destroy({ where: { idCliente: id, idSalao } })
        res.redirect('/clientes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MOSTRAR a página de cadastro de cliente (formulário em branco)
export const exibirCadastroCliente = (req, res) => {
    res.render('cadastroCliente')
}

export const exibirEdicaoCliente = async (req, res) => {
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const cliente = await Clientes.findOne({ where: { idCliente: id, idSalao } })
        
        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou acesso negado!' })
        }

        res.render('editarCliente', { cliente })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
