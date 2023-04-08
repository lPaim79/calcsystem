'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tatic_inputs', {
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      input_id: {
        type: Sequelize.INTEGER,
        references: { model: 'inputs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      tatic_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tatics', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },      
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tatic_inputs');
  }
};