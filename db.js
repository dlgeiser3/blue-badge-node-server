const Sequelize = require('sequelize');       
const sequelize = new Sequelize('blue-node-modules', 'postgres', 'Izanagi31', {
    host: 'localhost', 
    dialect: 'postgres'
});
       
sequelize.authenticate().then(
    function() { 
        console.log('***** Connected to blue-node-modules postgres database *****');
    },
    function(err){ 
        console.log(err);
    }
);
module.exports = sequelize;