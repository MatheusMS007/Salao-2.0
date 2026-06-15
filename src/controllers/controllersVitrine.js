import Saloes from '../models/modelSalao.js'
import Solicitacoes from '../models/modelSolicitacao.js'

// EXIBIR a vitrine com todos os salões
export const exibirVitrine = async (req, res) => {
    try {
        const saloes = await Saloes.findAll({ order: [['nome', 'ASC']] })
        res.render('vitrine', { saloes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EXIBIR a página de um salão específico com formulário de solicitação
export const exibirSalao = async (req, res) => {
    const { id } = req.params

    try {
        const salao = await Saloes.findByPk(id)

        if (!salao) {
            return res.status(404).render('erro', { mensagem: 'Salão não encontrado!' })
        }

        res.render('salao', { salao, sucesso: req.query.sucesso })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// CRIAR uma solicitação de agendamento
export const criarSolicitacao = async (req, res) => {
    const { nome, telefone, email, servico, data, hora } = req.body
    const idSalao = req.params.id

    if (!nome || !telefone || !servico || !data || !hora) {
        return res.status(400).render('erro', { mensagem: 'Todos os campos obrigatórios devem ser preenchidos!' })
    }

    try {
        await Solicitacoes.create({ nome, telefone, email, servico, data, hora, idSalao })
        res.redirect(`/vitrine/${idSalao}?sucesso=1`)
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
