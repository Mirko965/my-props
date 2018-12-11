import React from 'react'
import Modal from 'react-modal'
import TextFieldGroup from '../common/TextFieldGroup'

Modal.setAppElement(document.getElementById('root'))

const LoginModal = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      closeTimeoutMS={300}
      className='register__modal'
      contentLabel="Register Modal"
    >
      <div className='form'>
        <h1>Log In</h1>
        <p>Sign in to your DevConnector account</p>

        <form className='form__input' onSubmit={props.onSubmit}>
          <TextFieldGroup
            placeholder="Email Address"
            name="email"
            type="email"
            value={props.email}
            onChange={props.onChange}
            error={props.errors.email}
          />
          <TextFieldGroup
            placeholder="Password"
            name="password"
            type="password"
            value={props.password}
            onChange={props.onChange}
            error={props.errors.password}
          />
          <button className='form__input--button'>Submit</button>
        </form>

      </div>
    </Modal>

  )
}

export default LoginModal
