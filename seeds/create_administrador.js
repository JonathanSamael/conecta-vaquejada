/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
*/

const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('administradores').del()
  await knex('administradores').insert([
    { cpf: '123.456.789-00', senha: bcrypt.hashSync('123456', 10) },
  ]);
};
