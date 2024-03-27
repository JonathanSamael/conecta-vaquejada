/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
     return knex.schema.createTable('vaquejadas', function (table) {
          table.increments('id');
          table.string('nome');
          table.string('nome_dono');
          table.string('foto');
          table.string('status');
          table.string('descriçao', 1000);
          table.string('banner');
          table.string('regras', 1000);
          table.string('ordem', 1000);
     });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
     return knex.schema.dropTable('vaquejadas');
};
