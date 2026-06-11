import bcrypt from 'bcryptjs'
import Usuarios from '../models/modelUsuario.js'
import Saloes from '../models/modelSalao.js'

// EXIBIR formulário estático para o ADM criar um dono de salão
export const exibirCadastroDono = (req, res) => {
    // Serve um HTML estático para poupar processamento no servidor
    res.sendFile('cadastroDono.html', { root: './src/public' })
}

// CRIAR um novo usuário com perfil 'dono' e associar a um salão
export const criarDono = async (req, res) => {
    const { nome, email, senha, idSalao } = req.body

    // Validação básica
    if (!nome || !email || !senha || !idSalao) {
        return res.status(400).render('erro', { mensagem: 'Todos os campos são obrigatórios!' })
    }

    try {
        // Checa se o salão existe (opcional, aumenta robustez)
        const salao = await Saloes.findByPk(idSalao)
        if (!salao) {
            return res.status(400).render('erro', { mensagem: 'Salão não encontrado.' })
        }

        // Criptografa a senha antes de salvar
        const hash = await bcrypt.hash(senha, 10)

        // Cria o usuário com perfil 'dono' e vincula ao salão
        await Usuarios.create({ nome, email, senha: hash, perfil: 'dono', idSalao })

        // Redireciona para a lista de donos (poderíamos criar a view depois)
        res.redirect('/donos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// LISTAR donos (apenas para ADM) - opcional: cria view dinâmica depois
export const listarDonos = async (req, res) => {
    try {
        const donos = await Usuarios.findAll({ where: { perfil: 'dono' }, order: [['nome', 'ASC']] })
        res.render('donos', { donos })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// DELETAR um dono (usuário com perfil 'dono')
// Recebe: idDono via parâmetro da URL ou body
// Faz: encontra o dono, verifica se existe, deleta do banco
// Retorna: redireciona para /donos
export const deletarDono = async (req, res) => {
    const { id } = req.params // extrai o ID da URL (ex: /donos/1)

    if (!id) {
        return res.status(400).render('erro', { mensagem: 'ID do dono é obrigatório!' })
    }

    try {
        // Busca o dono pelo ID
        const dono = await Usuarios.findByPk(id)

        // Se não encontrar, retorna erro
        if (!dono) {
            return res.status(404).render('erro', { mensagem: 'Dono não encontrado!' })
        }

        // Valida se é realmente um dono (perfil 'dono')
        if (dono.perfil !== 'dono') {
            return res.status(403).render('erro', { mensagem: 'Usuário não é um dono de salão!' })
        }

        // Deleta o dono do banco de dados
        await Usuarios.destroy({ where: { idUsuario: id } })

        // Redireciona para a lista de donos
        res.redirect('/donos')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// API para retornar salões (JSON) usada pelo formulário estático para popular o select
export const apiSaloes = async (req, res) => {
    try {
        const saloes = await Saloes.findAll({ order: [['nome', 'ASC']] })
        res.json(saloes)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
