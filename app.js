require('dotenv').config;

let express = require('express');
let app = express();
let sequelize = require('./db');
let bodyParser = require('body-parser');

let user = require('./controllers/usercontroller');
let journal = require('./controllers/journalcontroller');

sequelize.sync();
// sequelize.sync({force:true});
app.use(bodyParser.json());
app.use(require('./middleware/headers'));

app.use('/user', user);
app.use('/journal', journal)

app.listen(3000, function(){
  console.log('*************** App is listening on port 3000 ***************');
})