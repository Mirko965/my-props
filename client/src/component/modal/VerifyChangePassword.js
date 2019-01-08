import React from 'react'
import Modal from 'react-modal'


const VerifyChangePassword = (props) => {
  const {message} = props.message
  return (
    <Modal
      overlayClassName='login__modal--overlay'
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      closeTimeoutMS={300}
      className='login__modal'
      contentLabel="Login Modal"
      appElement={document.getElementById('root')}
    >
      <div className='form'>
        <h1>Check your email address</h1>
        <p>Checkout your email, and click on link to change password, </p>
        <p>{message}</p>
      </div>
    </Modal>
  )
}

export default VerifyChangePassword
