import Agendamentos from '../models/modelAgendamento.js'
import Clientes from '../models/modelCliente.js'

// ===================================================================
// CONTROLADOR DE AGENDAMENTOS
// ===================================================================
// IMPORTANTE: APENAS DONOS DE SALÃO CONSEGUEM ACESSAR ESSAS FUNÇÕES
// O middleware verificarNaoAdm bloqueia ADM Master nas rotas
// ADM Master é redirecionado para /saloes ao tentar acessar agendamentos
// ===================================================================

// CADASTRAR um novo agendamento
// Recebe: idCliente, servico, data, hora (via POST do formulário)
// Faz: valida dados, cria novo registro com status 'pendente' associado ao salão do usuário
// Retorna: redireciona para lista de agendamentos
export const criarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body // pega os dados enviados pelo formulário
    const idSalao = req.session.usuario.idSalao // pega o ID do salão do usuário logado

    // Valida se todos os campos obrigatórios foram preenchidos
    if (!idCliente || !servico || !data || !hora) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    // Validação: verifica se o usuário tem um salão associado
    if (!idSalao) {
        return res.status(400).render('erro', { mensagem: 'Usuário não tem um salão associado!' })
    }

    try {
        // Validação: verifica se o cliente existe e pertence ao salão do usuário
        const cliente = await Clientes.findOne({ where: { idCliente, idSalao } })
        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        // Cria novo agendamento com status 'pendente' por padrão
        // idSalao é incluído para garantir isolamento de dados
        await Agendamentos.create({ idCliente, servico, data, hora, status: 'pendente', idSalao })
        res.redirect('/agendamentos') // redireciona para a lista de agendamentos
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// LISTAR todos os agendamentos (com o nome do cliente junto)
// Busca: agendamentos do salão do usuário logado, ordenados por data e hora
// Join: une com tabela Clientes para exibir nome do cliente
// Retorna: renderiza view 'agendamentos' com lista filtrada
export const listarAgendamentos = async (req, res) => {
    const idSalao = req.session.usuario.idSalao // pega o ID do salão do usuário logado

    try {
        // Busca agendamentos APENAS do salão do usuário logado
        // WHERE idSalao = valor garante isolamento de dados
        const agendamentosRaw = await Agendamentos.findAll({
            where: { idSalao }, // filtra por salão do usuário
            include: [{ model: Clientes, attributes: ['nome'] }], // inclui dados do cliente (nome)
            order: [['data', 'ASC'], ['hora', 'ASC']] // ordena por data depois por hora (crescente)
        })

        // Transforma resultado para formato esperado pela view
        // Adiciona campo 'nomeCliente' extraído do relacionamento
        const agendamentos = agendamentosRaw.map((agendamento) => {
            const item = agendamento.toJSON() // converte instância Sequelize para objeto
            return {
                ...item,
                nomeCliente: item.Cliente ? item.Cliente.nome : '' // extrai nome do cliente se existir
            }
        })

        res.render('agendamentos', { agendamentos }) // mostra a página com a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EDITAR um agendamento
// Recebe: idCliente, servico, data, hora (via formulário) + id (via URL)
// Faz: valida permissão, valida cliente, atualiza agendamento
// Retorna: redireciona para /agendamentos
export const atualizarAgendamento = async (req, res) => {
    const { idCliente, servico, data, hora } = req.body // pega os novos dados do formulário
    const id = req.params.id // pega o id do agendamento que está na URL
    const idSalao = req.session.usuario.idSalao // pega o salão do usuário logado

    try {
        // Validação 1: verifica se agendamento existe e pertence ao salão do usuário
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou não pertence ao seu salão!' })
        }

        // Validação 2: verifica se o novo cliente existe e pertence ao salão
        const cliente = await Clientes.findOne({ where: { idCliente, idSalao } })
        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        // Atualiza o agendamento (sem alterar idSalao, mantém isolamento)
        await Agendamentos.update(
            { idCliente, servico, data, hora },
            { where: { idAgendamento: id, idSalao } } // double-check: atualiza apenas se pertence ao salão
        )
        res.redirect('/agendamentos') // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// MARCAR um agendamento como REALIZADO
// Recebe: id (via URL)
// Faz: valida permissão, atualiza status para 'realizado'
// Retorna: redireciona para /agendamentos
export const marcarRealizado = async (req, res) => {
    const id = req.params.id // pega o id do agendamento que está na URL
    const idSalao = req.session.usuario.idSalao // pega o salão do usuário logado

    try {
        // Validação: verifica se agendamento existe e pertence ao salão do usuário
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou não pertence ao seu salão!' })
        }

        // Atualiza o status para 'realizado'
        await Agendamentos.update(
            { status: 'realizado' },
            { where: { idAgendamento: id, idSalao } } // double-check: atualiza apenas se pertence ao salão
        )
        res.redirect('/agendamentos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// APAGAR um agendamento
// Recebe: id (via URL)
// Faz: valida permissão, deleta agendamento
// Retorna: redireciona para /agendamentos
export const removerAgendamento = async (req, res) => {
    const id = req.params.id // pega o id do agendamento
    const idSalao = req.session.usuario.idSalao // pega o salão do usuário logado

    try {
        // Validação: verifica se agendamento existe e pertence ao salão do usuário
        const agendamento = await Agendamentos.findOne({ where: { idAgendamento: id, idSalao } })
        if (!agendamento) {
            return res.status(404).render('erro', { mensagem: 'Agendamento não encontrado ou não pertence ao seu salão!' })
        }

        // Deleta o agendamento
        await Agendamentos.destroy({ where: { idAgendamento: id, idSalao } })
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
