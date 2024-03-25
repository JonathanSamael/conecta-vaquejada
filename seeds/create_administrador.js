/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
*/

const bcrypt = require('bcrypt');
const senha = process.env.SENHA_HASH;

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('administradores').del()
  await knex('administradores').insert([
    { cpf: '123.456.789-00', senha: sha1(senha)},
  ]);
};
