export const verificarLogin = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/login')
    }
    next()
}

export const verificarAdm = (req, res, next) => {
    if (req.session.usuario.perfil !== 'adm') {
        return res.redirect('/clientes')
    }
    next()
}

export const verificarNaoAdm = (req, res, next) => {
    if (req.session.usuario.perfil === 'adm') {
        return res.redirect('/saloes')
    }
    next()
}
