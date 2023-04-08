'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize)=>{
    return queryInterface.addColumn('budget_materials','quantity', {
      type:Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('budget_materials', 'quantity');
  }
};
