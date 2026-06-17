import Solicitacoes from '../models/modelSolicitacao.js'

// LISTAR todas as solicitações do salão do dono logado
export const listarSolicitacoes = async (req, res) => {
    const idSalao = req.session.usuario.idSalao

    try {
        const solicitacoes = await Solicitacoes.findAll({
            where: { idSalao },
            order: [['data', 'ASC'], ['hora', 'ASC']]
        })
        res.render('solicitacoes', { solicitacoes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// CONFIRMAR uma solicitação
export const confirmarSolicitacao = async (req, res) => {
    const { id } = req.params
    const idSalao = req.session.usuario.idSalao

    try {
        const solicitacao = await Solicitacoes.findOne({ where: { idSolicitacao: id, idSalao } })

        if (!solicitacao) {
            return res.status(404).render('erro', { mensagem: 'Solicitação não encontrada!' })
        }

        await Solicitacoes.update({ status: 'confirmado' }, { where: { idSolicitacao: id, idSalao } })
        res.redirect('/solicitacoes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// RECUSAR uma solicitação
export const recusarSolicitacao = async (req, res) => {
    const { id } = req.params
    const idSalao = req.session.usuario.idSalao

    try {
        const solicitacao = await Solicitacoes.findOne({ where: { idSolicitacao: id, idSalao } })

        if (!solicitacao) {
            return res.status(404).render('erro', { mensagem: 'Solicitação não encontrada!' })
        }

        await Solicitacoes.update({ status: 'recusado' }, { where: { idSolicitacao: id, idSalao } })
        res.redirect('/solicitacoes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
