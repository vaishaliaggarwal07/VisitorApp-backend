const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./contoller/sequelize'); // add sequlize file from controller
const visitor_Routes = require('./routes/routes'); // pulling all routes in visitor routes
// const { upload_image } = require('./contoller/visitor_controller');
const multer = require('multer');

const cors = require('cors');
const corsOptions = { origin: '20.55.109.32', }


const app = express();
const port = 80;
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const upload = multer();


sequelize.sync() //sync model from sequlize file in controller
  .then(() => { console.log('Database and tables created!'); })
  .catch(err => { console.error('Error syncing the database:', err); });

 
  




// adding routes here or middleware
app.post('/insert_visitor', visitor_Routes);//insert visitor is insert information into table
app.get('/all_visitor', visitor_Routes)// Display visitor list data
app.patch('/update_visitor', visitor_Routes) // update visitor is edit visitor route
app.patch('/check_out', visitor_Routes)// when checking out value
app.patch('/delete_visitor', visitor_Routes)// when deleting visitor from database

// filter's   
app.get('/date_filter', visitor_Routes) // filter on based on date
app.get('/active_status', visitor_Routes)//filter based on active visitor status 
app.get('/deactive_status', visitor_Routes)//filter based on deactivate staus
app.get('/name_filter', visitor_Routes)//filter based on name of visitor 
app.post('/upload', visitor_Routes);

app.post('/register_employee', visitor_Routes);
app.post('/register_admin', visitor_Routes)
app.get('/login_admin', visitor_Routes)
app.get('/login_Employee', visitor_Routes)
app.post('/register_visitor', visitor_Routes)

app.use('/uploads', express.static('uploads'));
app.get('/all_visitor_employee',visitor_Routes)  /////// use this route for checking employees data inserted
app.post('/send-verification-email',visitor_Routes)
app.post('/verify-otp',visitor_Routes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // console.log(req)
});
