'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize)=>{
    return queryInterface.addColumn('budgets',
    'materialsValue', {
      type:Sequelize.FLOAT,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('budgets', 'materialsValue');
  }
};
