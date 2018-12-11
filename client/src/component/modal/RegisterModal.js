import React from 'react'
import TextFieldGroup from '../common/TextFieldGroup'
import Modal from 'react-modal'

Modal.setAppElement(document.getElementById('root'))
const RegisterModal = (props) => {
  
    return (
        <Modal
          isOpen={props.isOpen}
          onRequestClose={props.onRequestClose}
          closeTimeoutMS={300}
          className='register__modal'
          contentLabel="Register Modal"
        >

          <div className='form'>
            <h1>Sign Up</h1>
            <p>Create your account</p>
            <form className='form__input' onSubmit={props.onSubmit}>
              <TextFieldGroup
                type='text'
                placeholder='Name'
                name='name'
                value={props.nameValue}
                onChange={props.onChange}
                error={props.nameError}
              />
              <TextFieldGroup
                type='email'
                placeholder='Email'
                name='email'
                value={props.emailValue}
                onChange={props.onChange}
                error={props.emailError}
              />
              <TextFieldGroup
                type='text'
                placeholder='Username'
                name='username'
                value={props.usernameValue}
                onChange={props.onChange}
                error={props.usernameError}
              />
              <TextFieldGroup
                type='password'
                placeholder='Password'
                name='password'
                value={props.passValue}
                onChange={props.onChange}
                error={props.passError}
              />
              <TextFieldGroup
                type='password'
                placeholder='Password'
                name='password2'
                value={props.pass2Value}
                onChange={props.onChange}
                error={props.pass2Error}
              />
              <button className='form__input--button'>Submit</button>
            </form>
          </div>

        </Modal>

    )
}

export default RegisterModal
