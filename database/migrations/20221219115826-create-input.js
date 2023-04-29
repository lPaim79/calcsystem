'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inputs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      efficiency: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unitprice: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      color: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        //references: { model: 'providers', key: 'id' },
       //onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        //onDelete: 'SET NULL', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      machine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        //references: { model: 'machines', key: 'id' },
        //onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        //onDelete: 'SET NULL', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
      },
      printer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        //references: { model: 'printers', key: 'id' },
        //onUpdate: 'CASCADE', //CASCADE -> ATUALIZA CASO SEJA MODIFICADO O ID DA TABELA PROVIDERS
        //onDelete: 'SET NULL', //SET NULL -> DEIXA O CAMPO NULO CASO SEJA DELETADO O PROVIDER ESPECÍFICO
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
    return queryInterface.dropTable('inputs');
  }
};
