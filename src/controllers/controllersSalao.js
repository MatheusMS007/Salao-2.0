import Saloes from '../models/modelSalao.js'

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
