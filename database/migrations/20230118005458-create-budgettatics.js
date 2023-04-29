'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('budgettatics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      time: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      hourprice: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'budgets', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'CASCADE', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      
      },
      tatic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tatics', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'CASCADE', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('budgettatics');
  }
};