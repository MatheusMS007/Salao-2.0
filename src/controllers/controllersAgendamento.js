import Agendamentos from '../models/modelAgendamento.js'
import Clientes from '../models/modelCliente.js'

// CADASTRAR um novo agendamento
export const criarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body // pega os dados enviados pelo formulário

    if (!idCliente || !servico || !data || !hora) { // verifica se todos os campos foram preenchidos
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    try {
        await Agendamentos.create({ idCliente, servico, data, hora, status: 'pendente' })
        res.redirect('/agendamentos') // redireciona para a lista de agendamentos
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// LISTAR todos os agendamentos (com o nome do cliente junto)
export const listarAgendamentos = async (req, res) => {
    try {
        const agendamentosRaw = await Agendamentos.findAll({
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

        res.render('agendamentos', { agendamentos }) // mostra a página com a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EDITAR um agendamento
export const atualizarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body // pega os novos dados do formulário
    const id = req.params.id                            // pega o id do agendamento que está na URL

    try {
        await Agendamentos.update(
            { idCliente, servico, data, hora },
            { where: { idAgendamento: id } }
        )
        res.redirect('/agendamentos') // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MARCAR um agendamento como REALIZADO
export const marcarRealizado = async (req, res) => {
    const id = req.params.id // pega o id do agendamento que está na URL

    try {
        await Agendamentos.update(
            { status: 'realizado' },
            { where: { idAgendamento: id } }
        )
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// APAGAR um agendamento
export const removerAgendamento = async (req, res) => {
    const id = req.params.id

    try {
        await Agendamentos.destroy({ where: { idAgendamento: id } })
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MOSTRAR a página de cadastro de agendamento (formulário em branco)
export const exibirCadastroAgendamento = async (req, res) => {
    try {
        const clientes = await Clientes.findAll({ order: [['nome', 'ASC']] })
        res.render('cadastroAgendamento', { clientes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MOSTRAR a página de edição de agendamento (formulário já preenchido)
export const exibirEdicaoAgendamento = async (req, res) => {
    const id = req.params.id

    try {
        const agendamento = await Agendamentos.findByPk(id)
        const clientes = await Clientes.findAll({ order: [['nome', 'ASC']] })
        res.render('editarAgendamento', { agendamento, clientes }) // abre a página já preenchida
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
