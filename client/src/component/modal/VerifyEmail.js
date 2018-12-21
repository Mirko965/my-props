import React from 'react'
import Modal from 'react-modal'

Modal.setAppElement(document.getElementById('root'))
const VerifyEmail = (props) => {
  console.log(props)
  return (
    <Modal
      overlayClassName='login__modal--overlay'
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      closeTimeoutMS={300}
      className='login__modal'
      contentLabel="Login Modal"
    >
      <div className='form'>
        <h1>Verify your email address</h1>
        <p>Checkout your email, and click on link, </p>
      </div>
    </Modal>
  )
}

export default VerifyEmail
