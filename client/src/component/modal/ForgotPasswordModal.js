import React from 'react'
import TextFieldGroup from '../common/TextFieldGroup'
import Modal from 'react-modal'



const ForgotPasswordModal = (props) => {

  return (
    <Modal
      overlayClassName='login__modal--overlay'
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      closeTimeoutMS={300}
      className='register__modal'
      contentLabel="Forgot Password Modal"
      appElement={document.getElementById('root')}
    >
      <div className='form'>
        <h2>Are You forgot password ???</h2>
        <p>Send Your email address to reset passsword</p>
        <form className='form__input' onSubmit={props.onSubmit}>

          <TextFieldGroup
            placeholder="Email Address"
            name="email"
            type="email"
            value={props.email}
            onChange={props.onChange}
            error={props.emailError.email}
          />
          <button className='form__input--button'>Submit</button>
        </form>
      </div>
    </Modal>
  )
}

export default ForgotPasswordModal
