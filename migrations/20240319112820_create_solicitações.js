/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/

exports.up = function (knex) {
     return knex.schema.createTable("solicitacoes", (table) => {
          table.increments('id');
          table.string('nomeCompleto');
          table.string('cidade');
          table.string('estado');
          table.string('nomeVaquejada');
          table.string('numeroContato');
          table.timestamp('dataDasolicitacao').defaultTo(knex.fn.now());
     })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
     return knex.schema.dropTable("solicitacoes");
};
