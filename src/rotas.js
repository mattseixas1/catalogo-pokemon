const express = require("express");
const { cadastrarPokemon, atualizarPokemon, encontrarPokemon, deletarPokemon, listarPokemon } = require("./controladores/pokemons");
const { cadastrarUsuario, login } = require("./controladores/usuarios");
const validarAuth = require("./intermediarios/autenticacao");
const rotas = express.Router();


rotas.post('/usuario/cadastrar', cadastrarUsuario)
rotas.post('/usuario/login', login)
rotas.use(validarAuth)
rotas.post('/pokemon/cadastrar', cadastrarPokemon)
rotas.patch('/pokemon/:id', atualizarPokemon)
rotas.get('/pokemon/:id', encontrarPokemon)
rotas.delete('/pokemon/:id', deletarPokemon)
rotas.get('/pokemon', listarPokemon)

module.exports = rotas