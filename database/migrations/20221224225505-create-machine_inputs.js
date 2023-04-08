'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('machine_inputs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      machine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'machines', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'CASCADE', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      
      },
      input_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inputs', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'CASCADE', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('machine_inputs');
  }
};