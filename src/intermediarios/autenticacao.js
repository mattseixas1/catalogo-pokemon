const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')
const pool = require('../conexao');


const validarAuth = async (req, res, next) => {
    let { authorization } = req.headers 

    if (!authorization) {
        return res.status(401).json({"mensagem": "Não Autorizado"})
    }

    const token = authorization.split(' ')[1]
try {
    const { id } = jwt.verify(token, senhaJwt)
    const { rows, rowCount } = await pool.query('select * from usuarios where id = $1', [id])

    if (rowCount < 1) {
        return res.status(401).json({"mensagem": "Não Autorizado"})
    }

    req.usuario = rows[0]
    next()
    
} catch (error) {
    return res.status(400).json({"mensagem": error.message})
}
}

module.exports = validarAuth


