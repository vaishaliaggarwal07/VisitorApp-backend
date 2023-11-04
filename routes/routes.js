const express = require('express');
const { insert_visitor,all_visitor_employee,verify_otp,send_verification_email, update_visitor,register_visitor, all_visitor, check_out, delete_visitor, date_filter, active_status, deactive_status, name_filter,upload_image } = require('../contoller/visitor_controller');
const router = express.Router();

router.route('/insert_visitor').post(insert_visitor);
router.route('/update_visitor').patch(update_visitor);
router.route('/all_visitor').get(all_visitor) 
router.route('/check_out').patch(check_out)
router.route('/delete_visitor').patch(delete_visitor)
router.route('/register_visitor').post(register_visitor)
router.route('/date_filter').get(date_filter)
router.route('/active_status').get(active_status)
router.route('/deactive_status').get(deactive_status)
router.route('/name_filter').get(name_filter)
router.route('/upload').post(upload_image)


router.route('/all_visitor_employee').get(all_visitor_employee) // use this route for when employee triger 
router.route('/send-verification-email').post(send_verification_email)
router.route('/verify-otp').post(verify_otp)
module.exports = router;
