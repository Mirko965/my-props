import React from 'react'
import TextFieldGroup from '../common/TextFieldGroup'
import Modal from 'react-modal'

const ChangePasswordModal = (props) => {

  return (

    <div>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        closeTimeoutMS={300}
        className='register__modal'
        contentLabel="Register Modal"
        appElement={document.getElementById('root')}
      >

        <div className='form'>
          <p>Change Password</p>
          <form className='form__input' onSubmit={props.onSubmit}>
            <TextFieldGroup
              type='password'
              placeholder='Old Password'
              name='oldPassword'
            value={props.oldPassword}
            onChange={props.onChange}
            error={props.errorOldPassword}
            />
            <TextFieldGroup
              type='password'
              placeholder='New Password'
              name='newPassword'
              value={props.newPassword}
              onChange={props.onChange}
              error={props.errorNewPassword}
            />
            <TextFieldGroup
              type='password'
              placeholder='Confirm New Password '
              name='newPassword2'
              value={props.newPassword2}
              onChange={props.onChange}
              error={props.errorNewPassword2}
            />
            <button
              className='form__input--button'
            >Submit
            </button>
          </form>
        </div>

      </Modal>

    </div>
  )
}

export default ChangePasswordModal
