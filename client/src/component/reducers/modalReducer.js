const initialState = {
  modalRegisterIsOpen:false,
  modalLoginIsOpen:false,
  modalVerifyEmailIsOpen:false
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
    default:
      return state
  }
}

export default modalReducer
