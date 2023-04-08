'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },      
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      payment: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      prevision: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'clients', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'SET NULL', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'SET NULL', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      stage_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'stages', key: 'id' },
        onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        onDelete: 'SET NULL', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
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
    return queryInterface.dropTable('orders');
  }
};
