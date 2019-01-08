const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateForgotPassword = (data) => {
  let errors = {}

  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : ''
  data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : ''


  if (Validator.isEmpty(data.newPassword)){
    errors.newPassword = 'New Password field is required'
  }
  if (Validator.isEmpty(data.newPassword2)){
    errors.newPassword2 = 'Confirm Password field is required'
  }
  if (!Validator.equals(data.newPassword ,data.newPassword2)) {
    errors.newPassword2 = 'Password must match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
module.exports = validateForgotPassword
