'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('prints', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sides: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      format: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      color: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      coverage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      paper_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'papers', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'CASCADE', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      printer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'printers', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'CASCADE', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'budgets', key: 'id' },
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
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('prints');
  }
};