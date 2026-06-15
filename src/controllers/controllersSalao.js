import Saloes from '../models/modelSalao.js'
import Usuarios from '../models/modelUsuario.js'
import Clientes from '../models/modelCliente.js'
import Agendamentos from '../models/modelAgendamento.js'

// LISTAR todos os salões do sistema
export const listarSaloes = async (req, res) => {
    try {
        const saloes = await Saloes.findAll({ order: [['nome', 'ASC']] })
        res.render('saloes', { saloes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// CRIAR um novo salão no cadastro do ADM Master
export const criarSalao = async (req, res) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).render('erro', { mensagem: 'O nome do salão é obrigatório!' })
    }

    try {
        await Saloes.create({ nome })
        res.redirect('/saloes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EXIBIR o formulário de cadastro de salão
export const exibirCadastroSalao = (req, res) => {
    res.sendFile('cadastroSalao.html', { root: './src/public' })
}

// DELETAR um salão
// Recebe: idSalao via parâmetro da URL
// Faz: encontra o salão, verifica se existe, deleta do banco
// Retorna: redireciona para /saloes
export const deletarSalao = async (req, res) => {
    const { id } = req.params // extrai o ID da URL (ex: /saloes/1)

    if (!id) {
        return res.status(400).render('erro', { mensagem: 'ID do salão é obrigatório!' })
    }

    try {
        // Busca o salão pelo ID
        const salao = await Saloes.findByPk(id)

        // Se não encontrar, retorna erro
        if (!salao) {
            return res.status(404).render('erro', { mensagem: 'Salão não encontrado!' })
        }

        // Verifica se existem donos vinculados ao salão
        const donos = await Usuarios.count({ where: { idSalao: id } })
        if (donos > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um salão com donos cadastrados!' })
        }

        // Verifica se existem clientes vinculados ao salão
        const clientes = await Clientes.count({ where: { idSalao: id } })
        if (clientes > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um salão com clientes cadastrados!' })
        }

        // Verifica se existem agendamentos vinculados ao salão
        const agendamentos = await Agendamentos.count({ where: { idSalao: id } })
        if (agendamentos > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um salão com agendamentos cadastrados!' })
        }

        // Deleta o salão do banco de dados
        await Saloes.destroy({ where: { idSalao: id } })

        // Redireciona para a lista de salões
        res.redirect('/saloes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
