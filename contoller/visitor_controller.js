const { Op } = require('sequelize');
const multer = require('multer')
const nodemailer = require('nodemailer');
// const { upload_image } = require('./contoller/visitor_controller');
const fs = require('fs');
const path = require('path');

//importing model
const { Visitor_information, sequelize, Visitor_employee_registered , EmployeeOTP} = require('./sequelize');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const visitorController = {

  image_filename: '',
  upload_image: async (req, res) => {
    upload.single('image')(req, res, (err) => {
      
      if (err) {
        res.send(err)
        // return res.status(400).json({ message: 'Error uploading file.' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      visitorController.image_filename = req.file.filename;
      // res.send(req.file.filename);
      
      return res.status(200).json({ message: 'File uploaded successfully.' });
    })
  },


  insert_visitor: async (req, res) => {
    try {

      //

      const jsonData = req.body; //replace req.query with req.body
      const {
        visitor_name,
        visitor_email,
        visitor_phone_number,
        visitor_organization,
        visitor_purpose,
        visitor_whom_meet,//vishal sir === 01 
        //employee id =01
        visit_date,
        visit_time,
        // employeeId,  
      } = jsonData[0]; // replace jsonData with jsonData[0]
      // if (!visitor_name || !visitor_email || !visitor_phone_number || !visitor_organization || !visitor_purpose || !visitor_whom_meet || !visit_date || !visit_time) {
      //   return res.status(400).json({ error: 'Missing required fields' });
      // }
console.log(visitorController.image_filename);
      const newVisitor = await Visitor_information.create({
        visitor_name,
        visitor_email,
        visitor_phone_number,
        visitor_organization,
        visitor_purpose,
        visitor_whom_meet,
        visit_date,
        visit_time,
        image_filename: visitorController.image_filename,
        // employeeId,  
      });
      visitorController.image_filename = '';

      res.status(200).json(newVisitor);
    } catch (error) {
      res.send(error);
      res.status(500).json({ error: 'Failed to insert visitor information.' });
    }
  },
  // Register visitor
  register_visitor: async (req, res) => {
    try {
      // 

      const jsonData = req.body; //replace req.query with req.body
      const {
        visitor_name,
        visitor_email,
        visitor_phone_number,
        visitor_organization,
        visitor_purpose,
        visitor_whom_meet,
        visit_date,
        visit_time,
        // employeeId,    // employeeId == mail of user login 
      } = jsonData[0]; // replace jsonData with jsonData[0]

      const newVisitor = await Visitor_information.create({
        visitor_name,
        visitor_email,
        visitor_phone_number,
        visitor_organization,
        visitor_purpose,
        visitor_whom_meet,
        visit_date,
        visit_time,
        image_filename: visitorController.image_filename,
        // employeeId,
      });
      visitorController.image_filename = '';

      res.status(200).json(newVisitor);
    } catch (error) {
      res.send(error);
      res.status(500).json({ error: 'Failed to insert visitor information.' });
    }

  },


  //this only update the requested field
  update_visitor: async (req, res) => {
    try {
      const { id } = req.body;
      const updatedFields = req.body;

      const [rowsUpdated] = await Visitor_information.update(updatedFields, {
        where: { id },
      });

      const responseMessage = rowsUpdated === 1 ? 'Visitor updated successfully' : 'Visitor not found';
      res.status(rowsUpdated === 1 ? 200 : 404).json({ message: responseMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update visitor information' });
    }
  },

  all_visitor: async (req, res) => {
    try {
      const all_visitors = await Visitor_information.findAll({
        where: {
          is_active: 1,
          
        },
        order: [['createdAt', 'DESC']],
      });
      // const baseImageUrl = 'http://localhost:3000/uploads';

      // Construct URLs for images and add them to the visitor objects
      const visitorsWithImages = all_visitors.map(visitor => {
        const imageRelativePath = visitor.image_filename; //  field name is image_filename
        const imageUrl = `${req.protocol}://${req.get(
          'host'
        )}/uploads/${imageRelativePath}`;
        const visitorWithImage = {
          ...visitor.toJSON(),
          image_url: imageUrl,
        };
        return visitorWithImage;
      });
      res.json(visitorsWithImages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error finding Visitor' });
    }
  },
  all_visitor_employee: async (req, res) => {
    try {
      const employeeId=req.body.employeeId
      console.log(employeeId)
      const all_visitors = await Visitor_information.findAll({
        where: {
          is_active: 1,
          employeeId:employeeId,

          
        },
        
        order: [['createdAt', 'DESC']],
        
      });
      // const baseImageUrl = 'http://localhost:3000/uploads';

      // Construct URLs for images and add them to the visitor objects
      const visitorsWithImages = all_visitors.map(visitor => {
        const imageRelativePath = visitor.image_filename; //  field name is image_filename
        const imageUrl = `${req.protocol}://${req.get(
          'host'
        )}/uploads/${imageRelativePath}`;
        const visitorWithImage = {
          ...visitor.toJSON(),
          image_url: imageUrl,
        };
        return visitorWithImage;
      });
      res.json(visitorsWithImages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error finding Visitor' });
    }
  },

  // check _out id to set status =0;
  check_out: async (req, res) => {
    try {
      const { id } = req.query;
      const [rowsUpdated] = await Visitor_information.update(
        { status_visitor: 0 }, // Set check_status to 0 (red/offline)
        { where: { id } }
      );
      console.log(id);
      const responseMessage =
        rowsUpdated === 1 ? 'Visitor checked out successfully' : 'Visitor not found';
      res.status(rowsUpdated === 1 ? 200 : 404).json({ message: responseMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to check out visitor' });
    }
  },

  //create a function to filter delete which will do active =0
  delete_visitor: async (req, res) => {
    try {
      const { id } = req.body;
      const deletefield = { is_active: 0, status_visitor: 0 };
      const [deleted_visitor] = await Visitor_information.update(deletefield, {
        where: { id },
      });
      const responseMessage = deleted_visitor === 1 ? 'Visitor information deleted' : 'visitor information not deleted';
      res.send(deleted_visitor === 1 ? 200 : 400).json({ message: responseMessage });
    } catch (error) {
      console.log(error)
    }
  },
  //filtering data usinga date 
  date_filter: async (req, res) => {
    try {
      const start_date = req.body;
      const end_date = req.body;
      const startDate = new Date(req.body.start_date);
      const endDate = new Date(req.body.end_date);
      console.log(start_date)
      console.log(end_date)
      const date_filter_data = await Visitor_information.findAll({
        where: {
          // is_active:1,
          visit_date: {

            [Op.between]: [startDate, endDate]

          },
          is_active: 1,
        }


      });

      console.log(date_filter_data);
      res.send(date_filter_data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error finding Visitors' });
    }
  },
  // filtering data using active status
  active_status: async (req, res) => {
    try {
      const all_visitor_active = await Visitor_information.findAll({

        where: {
          status_visitor: 1,
          is_active: 1,
        }
      })
      res.send(all_visitor_active)

    } catch (error) {
      console.log(error);
      res.send(500).json({ error })

    }
  },

  // deactive status check
  deactive_status: async (req, res) => {
    try {
      const inactive_visitor_status = await Visitor_information.findAll({
        where: {
          is_active: 1,
          status_visitor: 0,
        }
      })
      res.send(inactive_visitor_status)
    } catch (error) {
      console.log(error);
      res.send(500).json({ error })
    }
  },
  //name filter: in visitor list 
  name_filter: async (req, res) => {
    try {
      const { visitor_name } = req.body;
      const visitor_filter_name = await Visitor_information.findAll({
        where: {
          visitor_name: visitor_name,
          is_active: 1,
        }

      });

      // res.send(visitor_filter_name)
      if (visitor_filter_name.length === 0) {
        res.status(404).send("No visitors found with the provided name.");
      } else {
        res.send(visitor_filter_name);
      }
    } catch (error) {
      res.send(500).json({ error })
    }
  },
  send_verification_email:async (req,res) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'v3117415@gmail.com',
        pass: 'nxgsgvivmjsromew',
      },
    })
    try {
      const {recipientEmail} = req.body;
      const otp = Math.floor(1000000 + Math.random() * 900000);
      const expirationDate = new Date();
      const newOTP = await EmployeeOTP.create({
        employee_email: recipientEmail,
        otp: otp.toString(),
        expiration_date: expirationDate,
      });
  
      // console.log(newOTP);
      console.log(`Email: ${recipientEmail}, OTP: ${otp}`);
      const mailOptions = {
        from: 'v3117415@gmail.com',
        to: recipientEmail,
        subject: 'Email Verification OTP',
        text: `Your verification OTP is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      await EmployeeOTP.create({otp,employee_email:recipientEmail});
      
      res.status(200).json({message: 'Email sent successfully'});
    }catch (error){
      console.error('error sending email:',error);
      res.status(500).json({message:'An error occured'});
    }
  },
  verify_otp: async (req, res) => {
    try {
      const { enteredOTP, email } = req.body;
      const otpData = await EmployeeOTP.findOne({
        where: { employee_email: email },
      });
      console.log(enteredOTP);
      console.log(otpData);
      console.log(otpData.otp);
      if (!otpData) {
        return res.status(404).json({ verified: false, message: 'OTP not found' });
      }
      if (otpData.is_used) {
        return res.status(400).json({ verified: false, message: 'OTP already used' });
      }
      if (enteredOTP == otpData.otp) {
        otpData.is_used = true;
        otpData.save();
        return res.status(200).json({ verified: true });
      } else {
        return res.status(400).json({ verified: false });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ verified: false, message: 'An error occurred' });
    }
  }




};
module.exports = visitorController;
