/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
*/
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('administradores').del()
  await knex('administradores').insert([
    { cpf: '123.456.789-10', senha: ('123456') }

  ]);
};
