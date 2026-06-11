import Clientes from '../models/modelCliente.js'
import Agendamentos from '../models/modelAgendamento.js'

// ===================================================================
// CONTROLADOR DE CLIENTES
// ===================================================================
// IMPORTANTE: APENAS DONOS CONSEGUEM VER/CRIAR CLIENTES DO SEU SALÃO
// Cada cliente DEVE estar associado a um salão via idSalao
// ADM Master consegue acessar, mas vê clientes isolados por salão
// ===================================================================

// CADASTRAR um novo cliente
// Recebe: nome, telefone, email (via POST do formulário)
// Faz: valida dados, cria cliente associado ao salão do usuário logado
// Retorna: redireciona para /clientes
export const criarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body // pega os dados enviados pelo formulário
    const idSalao = req.session.usuario.idSalao // pega o ID do salão do usuário logado

    // Validação: verifica se nome e telefone foram preenchidos
    if (!nome || !telefone) {
        return res.status(400).json({ mensagem: 'Nome e telefone são obrigatórios!' })
    }

    // Validação: verifica se o usuário tem um salão associado
    if (!idSalao) {
        return res.status(400).render('erro', { mensagem: 'Usuário não tem um salão associado!' })
    }

    try {
        // Cria novo cliente com os dados + idSalao do usuário logado
        // Isso garante que o cliente pertence sempre ao salão correto
        await Clientes.create({ nome, telefone, email, idSalao })
        res.redirect('/clientes') // redireciona para a lista de clientes
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// LISTAR todos os clientes (filtrando por salão)
// Recebe: req.session.usuario.idSalao (do usuário logado)
// Faz: busca clientes apenas do salão do usuário
// Retorna: renderiza a view 'clientes' com lista filtrada
export const listarClientes = async (req, res) => {
    const idSalao = req.session.usuario.idSalao // pega o ID do salão do usuário logado

    try {
        // Busca clientes APENAS do salão do usuário logado
        // WHERE idSalao = valor garante que ADM vê dados isolados também
        const clientes = await Clientes.findAll({
            where: { idSalao }, // filtra por salão
            order: [['nome', 'ASC']] // ordena por nome (A-Z)
        })
        res.render('clientes', { clientes }) // mostra a página com a lista de clientes
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EDITAR um cliente
// Recebe: nome, telefone, email (via POST do formulário) + id (via URL)
// Faz: valida se cliente existe no salão do usuário, depois atualiza
// Retorna: redireciona para /clientes
export const atualizarCliente = async (req, res) => {
    const { nome, telefone, email } = req.body // pega os novos dados do formulário
    const id = req.params.id // pega o id do cliente que está na URL
    const idSalao = req.session.usuario.idSalao // pega o salão do usuário logado

    try {
        // Busca o cliente para verificar se pertence ao salão do usuário
        const cliente = await Clientes.findOne({ where: { idCliente: id, idSalao } })

        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        // Atualiza o cliente (sem alterar idSalao, mantém isolamento)
        await Clientes.update(
            { nome, telefone, email },
            { where: { idCliente: id, idSalao } } // double-check: atualiza apenas se pertence ao salão
        )
        res.redirect('/clientes') // volta para a lista
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// APAGAR um cliente
// Recebe: id (via URL)
// Faz: valida se tem agendamentos, valida permissão, então deleta
// Retorna: redireciona para /clientes
export const removerCliente = async (req, res) => {
    const id = req.params.id // pega o id do cliente que está na URL
    const idSalao = req.session.usuario.idSalao // pega o salão do usuário logado

    try {
        // Primeiro: verifica se o cliente existe no salão do usuário
        const cliente = await Clientes.findOne({ where: { idCliente: id, idSalao } })

        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou não pertence ao seu salão!' })
        }

        // Segundo: verifica se tem agendamentos (impede deletar cliente com agendamentos)
        const agendamentos = await Agendamentos.count({ where: { idCliente: id } })
        if (agendamentos > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um cliente com agendamentos cadastrados!' })
        }

        // Terceiro: deleta o cliente
        await Clientes.destroy({ where: { idCliente: id, idSalao } })
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
    const idSalao = req.session.usuario.idSalao

    try {
        const cliente = await Clientes.findOne({ where: { idCliente: id, idSalao } })
        
        if (!cliente) {
            return res.status(404).render('erro', { mensagem: 'Cliente não encontrado ou acesso negado!' })
        }

        res.render('editarCliente', { cliente }) // abre a página já preenchida com os dados
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
