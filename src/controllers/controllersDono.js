import bcrypt from 'bcryptjs'
import Usuarios from '../models/modelUsuario.js'
import Saloes from '../models/modelSalao.js'

export const exibirCadastroDono = (req, res) => {
    res.sendFile('cadastroDono.html', { root: './src/public' })
}

export const criarDono = async (req, res) => {
    const { nome, email, senha, idSalao } = req.body

    if (!nome || !email || !senha || !idSalao) {
        return res.status(400).render('erro', { mensagem: 'Todos os campos são obrigatórios!' })
    }

    try {
        const salao = await Saloes.findByPk(idSalao)
        if (!salao) {
            return res.status(400).render('erro', { mensagem: 'Salão não encontrado.' })
        }

        const hash = await bcrypt.hash(senha, 10)

        await Usuarios.create({ nome, email, senha: hash, perfil: 'dono', idSalao })

        res.redirect('/donos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const listarDonos = async (req, res) => {
    try {
        const donos = await Usuarios.findAll({ where: { perfil: 'dono' }, order: [['nome', 'ASC']] })
        res.render('donos', { donos })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const deletarDono = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).render('erro', { mensagem: 'ID do dono é obrigatório!' })
    }

    try {
        const dono = await Usuarios.findByPk(id)

        if (!dono) {
            return res.status(404).render('erro', { mensagem: 'Dono não encontrado!' })
        }

        // Valida se é realmente um dono (perfil 'dono')
        if (dono.perfil !== 'dono') {
            return res.status(403).render('erro', { mensagem: 'Usuário não é um dono de salão!' })
        }

        await Usuarios.destroy({ where: { idUsuario: id } })

        res.redirect('/donos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const apiSaloes = async (req, res) => {
    try {
        const saloes = await Saloes.findAll({ order: [['nome', 'ASC']] })
        res.json(saloes)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
