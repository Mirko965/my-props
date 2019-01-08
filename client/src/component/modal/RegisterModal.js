import React from 'react'
import TextFieldGroup from '../common/TextFieldGroup'
import Modal from 'react-modal'


const RegisterModal = (props) => {
  
    return (
        <Modal
          isOpen={props.isOpen}
          onRequestClose={props.onRequestClose}
          closeTimeoutMS={300}
          className='register__modal'
          contentLabel="Register Modal"
          appElement={document.getElementById('root')}
        >

          <div className='form'>
            <h1>Sign Up</h1>
            {props.errors.mongodb ? <p className='errorText'>{props.errors.mongodb}</p> : <p>Create your account</p>}
            <form className='form__input' onSubmit={props.onSubmit}>
              <TextFieldGroup
                type='text'
                placeholder='Name'
                name='name'
                value={props.nameValue}
                onChange={props.onChange}
                error={props.errors.name}
              />
              <TextFieldGroup
                type='email'
                placeholder='Email'
                name='email'
                value={props.emailValue}
                onChange={props.onChange}
                error={props.errors.email}
              />
              <TextFieldGroup
                type='text'
                placeholder='Username'
                name='username'
                value={props.usernameValue}
                onChange={props.onChange}
                error={props.errors.username}
              />
              <TextFieldGroup
                type='password'
                placeholder='Password'
                name='password'
                value={props.passValue}
                onChange={props.onChange}
                error={props.errors.password}
              />
              <TextFieldGroup
                type='password'
                placeholder='Confirm Password'
                name='password2'
                value={props.pass2Value}
                onChange={props.onChange}
                error={props.errors.password2}
              />
              <button className='form__input--button'>Submit</button>
            </form>
          </div>

        </Modal>

    )
}

export default RegisterModal
