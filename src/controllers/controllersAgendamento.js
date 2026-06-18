import Agendamentos from '../models/modelAgendamento.js'
import Clientes from '../models/modelCliente.js'

export const criarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body
    const idSalao = req.session.usuario.idSalao

    if (!idCliente || !servico || !data || !hora) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    if (!idSalao) {
        return res.status(400).render('erro', { mensagem: 'Usuário não tem um salão associado!' })
    }

    try {
        // Validação: verifica se o cliente existe e pertence ao salão do usuário
        const cliente = await Clientes.findOne({ where: { idCliente, idSalao } })
        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        await Agendamentos.create({ idCliente, servico, data, hora, status: 'pendente', idSalao })
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const listarAgendamentos = async (req, res) => {
    const idSalao = req.session.usuario.idSalao

    try {
        const agendamentosRaw = await Agendamentos.findAll({
            where: { idSalao },
            include: [{ model: Clientes, attributes: ['nome'] }],
            order: [['data', 'ASC'], ['hora', 'ASC']]
        })

        const agendamentos = agendamentosRaw.map((agendamento) => {
            const item = agendamento.toJSON()
            return {
                ...item,
                nomeCliente: item.Cliente ? item.Cliente.nome : ''
            }
        })

        res.render('agendamentos', { agendamentos })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const atualizarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou não pertence ao seu salão!' })
        }

        const cliente = await Clientes.findOne({ where: { idCliente, idSalao } })
        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        await Agendamentos.update(
            { idCliente, servico, data, hora },
            { where: { idAgendamento: id, idSalao } }
        )
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const marcarRealizado = async (req, res) => {
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou não pertence ao seu salão!' })
        }

        await Agendamentos.update(
            { status: 'realizado' },
            { where: { idAgendamento: id, idSalao } }
        )
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const removerAgendamento = async (req, res) => {
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou não pertence ao seu salão!' })
        }

        await Agendamentos.destroy({ where: { idAgendamento: id, idSalao } })
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const exibirCadastroAgendamento = async (req, res) => {
    const idSalao = req.session.usuario.idSalao

    try {
        const clientes = await Clientes.findAll({ where: { idSalao }, order: [['nome', 'ASC']] })
        res.render('cadastroAgendamento', { clientes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const exibirEdicaoAgendamento = async (req, res) => {
    const id = req.params.id
    const idSalao = req.session.usuario.idSalao

    try {
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou acesso negado!' })
        }

        const clientes = await Clientes.findAll({ where: { idSalao }, order: [['nome', 'ASC']] })
        res.render('editarAgendamento', { agendamento, clientes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
