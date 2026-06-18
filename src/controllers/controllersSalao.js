import Saloes from '../models/modelSalao.js'
import Usuarios from '../models/modelUsuario.js'
import Clientes from '../models/modelCliente.js'
import Agendamentos from '../models/modelAgendamento.js'

export const listarSaloes = async (req, res) => {
    try {
        const saloes = await Saloes.findAll({ order: [['nome', 'ASC']] })
        res.render('saloes', { saloes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const criarSalao = async (req, res) => {
    const { nome, telefone, endereco, descricao } = req.body

    if (!nome) {
        return res.status(400).render('erro', { mensagem: 'O nome do salão é obrigatório!' })
    }

    try {
        await Saloes.create({ nome, telefone, endereco, descricao })
        res.redirect('/saloes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const exibirCadastroSalao = (req, res) => {
    res.sendFile('cadastroSalao.html', { root: './src/public' })
}

export const deletarSalao = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).render('erro', { mensagem: 'ID do salão é obrigatório!' })
    }

    try {
        const salao = await Saloes.findByPk(id)

        if (!salao) {
            return res.status(404).render('erro', { mensagem: 'Salão não encontrado!' })
        }

        const donos = await Usuarios.count({ where: { idSalao: id } })
        if (donos > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um salão com donos cadastrados!' })
        }

        const clientes = await Clientes.count({ where: { idSalao: id } })
        if (clientes > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um salão com clientes cadastrados!' })
        }

        const agendamentos = await Agendamentos.count({ where: { idSalao: id } })
        if (agendamentos > 0) {
            return res.status(400).render('erro', { mensagem: 'Não é possível apagar um salão com agendamentos cadastrados!' })
        }

        await Saloes.destroy({ where: { idSalao: id } })

        res.redirect('/saloes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
