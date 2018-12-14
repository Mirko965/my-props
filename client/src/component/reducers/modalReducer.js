const initialState = {
  modalRegisterIsOpen:false,
  modalLoginIsOpen:false
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
    default:
      return state
  }
}

export default modalReducer