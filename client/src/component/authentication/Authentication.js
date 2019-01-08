import React, { Component } from 'react'
import connect from 'react-redux/es/connect/connect'
import { withRouter } from 'react-router-dom'
import {
  loginUser,
  mailForResetPassword,
  registerUser,
  temporaryRegisterUser
} from '../actions/authenticationAction'
import RegisterModal from '../modal/RegisterModal'
import { clearErrors } from '../actions/errorsAction'
import {
  modalForgotPasswordClose, modalForgotPasswordOpen, modalForgotPasswordVerifyClose, modalForgotPasswordVerifyOpen,
  modalLoginClose,
  modalLoginOpen,
  modalRegisterClose,
  modalRegisterOpen, modalVerifyEmailClose,
  modalVerifyEmailOpen
} from '../actions/modalAction'
import AuthenticationText from './AuthenticationText'
import LoginModal from '../modal/LoginModal'
import VerifyEmail from '../modal/VerifyEmail'
import ForgotPasswordModal from '../modal/ForgotPasswordModal'
import VerifyForgotPassword from '../modal/VerifyForgotPassword'
import VerifyChangePassword from '../modal/VerifyChangePassword'

class Authentication extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      username:'',
      password: '',
      password2: '',
      errors: {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.errors){
      this.setState(() => ({
        errors:nextProps.errors,
      }))
    }
  }
  registerModalOpen = () => {
    this.props.clearErrors()
    this.props.modalRegisterOpen()
  }
  registerModalClose = () => {
    this.props.modalRegisterClose()
  }
  loginModalOpen = () => {
    this.props.clearErrors()
    this.props.modalLoginOpen()
  }
  loginModalClose = () => {
    this.props.modalLoginClose()
  }
  forgotPasswordModalClose = () => {
    this.props.clearErrors()
    this.props.modalForgotPasswordClose()
  }
  emailModalClose = () => {
    this.props.modalVerifyEmailClose()
  }
  emailForgotPasswordModalClose = () => {
    this.props.modalForgotPasswordVerifyClose()
  }
  onChange = (event) => {
    event.persist()
    this.setState(() => ({
      [event.target.name]: event.target.value
    }))
  }

  onSubmit = (event) => {
    event.preventDefault()
    const user = {
      name: this.state.name,
      email: this.state.email,
      username:this.state.username,
      password: this.state.password,
      password2: this.state.password2,
    }
    this.props.temporaryRegisterUser(user)
    this.setState(() => ({
      name: '',
      email: '',
      username:'',
      password: '',
      password2: ''
    }))
  }
  loginOnSubmit = (event) => {
    event.preventDefault()
    const user = {
      email:this.state.email,
      password: this.state.password
    }

    this.props.loginUser(user,this.props.history)
    this.setState(() => ({
      email: '',
      password: ''
    }))
  }

  forgotPasswordOnChange = event => {
    event.persist()
    this.setState(() => ({
      [event.target.name]: event.target.value
    }))
  }
  forgotPasswordSubmit = event => {
    event.preventDefault()
    this.props.mailForResetPassword(this.state.email,this.props.history)
    this.setState(() => ({
      email:''
    }))
  }

  render () {

    const {errors} = this.state
    const {message} = this.props.authentication

    return (

      <div className='authentication'>
        <h1>Authentication</h1>
        <div className='authentication__button'>
          <button onClick={this.loginModalOpen}>Login</button>
          <button onClick={this.registerModalOpen}>Sign Up</button>
        </div>
        <AuthenticationText/>
        <RegisterModal
          isOpen={this.props.modal.modalRegisterIsOpen}
          onChange={this.onChange}
          onRequestClose={this.registerModalClose}
          onSubmit={this.onSubmit}
          nameValue={this.state.name}
          emailValue={this.state.email}
          usernameValue={this.state.username}
          passValue={this.state.password}
          pass2Value={this.state.password2}
          errors={errors}
        />
        <LoginModal
          isOpen={this.props.modal.modalLoginIsOpen}
          onRequestClose={this.loginModalClose}
          onSubmit={this.loginOnSubmit}
          onChange={this.onChange}
          password={this.state.password}
          email={this.state.email}
          errors={errors}
        />

        <VerifyEmail
          isOpen={this.props.modal.modalVerifyEmailIsOpen}
          onRequestClose={this.emailModalClose}
          message={message}
        />

        <VerifyChangePassword
          isOpen={this.props.modal.modalChangePasswordVerifyIsOpen}
          onRequestClose={this.emailModalClose}
          message={message}
        />

        <VerifyForgotPassword
          isOpen={this.props.modal.modalForgotPasswordVerifyIsOpen}
          onRequestClose={this.emailForgotPasswordModalClose}
          message={message}
        />

        <ForgotPasswordModal
          isOpen={this.props.modal.modalForgotPasswordIsOpen}
          onRequestClose={this.forgotPasswordModalClose}
          onChange={this.forgotPasswordOnChange}
          onSubmit={this.forgotPasswordSubmit}
          value={this.state.email}
          emailError={this.props.errors}
        />

      </div>
    )
  }
}


const mapStateToProps = (state) => {

  return {
    authentication:state.authenticate,
    errors:state.errors,
    modal:state.modal
  }
}
export default withRouter(connect(mapStateToProps, {
  temporaryRegisterUser,
  registerUser,
  loginUser,
  clearErrors,
  modalRegisterOpen,
  modalRegisterClose,
  modalLoginOpen,
  modalLoginClose,
  modalVerifyEmailOpen,
  modalVerifyEmailClose,
  modalForgotPasswordOpen,
  modalForgotPasswordClose,
  mailForResetPassword,
  modalForgotPasswordVerifyOpen,
  modalForgotPasswordVerifyClose,

})(Authentication))
