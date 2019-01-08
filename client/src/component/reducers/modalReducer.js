const initialState = {
  modalRegisterIsOpen:false,
  modalLoginIsOpen:false,
  modalVerifyEmailIsOpen:false,
  modalChangePasswordIsOpen:false,
  modalForgotPasswordIsOpen:false,
  modalVerifyPasswordIsOpen:false,
  modalForgotPasswordVerifyIsOpen:false,
  modalChangePasswordVerifyIsOpen:false
}

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MODAL_REGISTER_OPEN':
      return {modalRegisterIsOpen:true}
    case 'MODAL_REGISTER_CLOSE':
      return {modalRegisterIsOpen:false}
    case 'MODAL_LOGIN_OPEN':
      return {modalLoginIsOpen:true}
    case 'MODAL_LOGIN_CLOSE':
      return {modalLoginIsOpen:false}
    case 'MODAL_VERIFYEMAIL_OPEN':
      return {modalVerifyEmailIsOpen:true}
    case 'MODAL_VERIFYEMAIL_CLOSE':
      return {modalVerifyEmailIsOpen:false}
    case 'MODAL_VERIFYPASSWORD_OPEN':
      return {modalVerifyPasswordIsOpen:true}
    case 'MODAL_VERIFYPASSWORD_CLOSE':
      return {modalVerifyPasswordIsOpen:false}
    case 'MODAL_CHANGE_PASSWORD_OPEN':
      return {modalChangePasswordIsOpen:true}
    case 'MODAL_CHANGE_PASSWORD_CLOSE':
      return {modalChangePasswordIsOpen:false}
    case 'MODAL_FORGOT_PASSWORD_OPEN':
      return {modalForgotPasswordIsOpen:true}
    case 'MODAL_FORGOT_PASSWORD_CLOSE':
      return {modalForgotPasswordIsOpen:false}
    case 'MODAL_FORGOT_PASSWORD_VERIFY_OPEN':
      return {modalForgotPasswordVerifyIsOpen:true}
    case 'MODAL_FORGOT_PASSWORD_VERIFY_CLOSE':
      return {modalForgotPasswordVerifyIsOpen:false}
    case 'MODAL_CHANGE_PASSWORD_VERIFY_OPEN':
      return {modalChangePasswordVerifyIsOpen:true}
    case 'MODAL_CHANGE_PASSWORD_VERIFY_CLOSE':
      return {modalChangePasswordVerifyIsOpen:false}
    default:
      return state
  }
}

export default modalReducer
