import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Spinner from '../common/Spinner'
import { deleteUser, tempPassword } from '../actions/authenticationAction'
import ChangePasswordModal from '../modal/ChangePasswordModal'
import { modalChangePasswordOpen, modalChangePasswordClose } from '../actions/modalAction'
import { clearErrors } from '../actions/errorsAction'
import PageNotFound from '../layout/PageNotFound'

class PrivatePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      oldPassword:'',
      newPassword:'',
      newPassword2:'',
      errors:{}
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.errors){
      this.setState(() => ({
        errors:nextProps.errors,
      }))
    }
  }

  modalOpen = () => {
    this.props.modalChangePasswordOpen()
  }
  modalClose = () => {
    this.props.modalChangePasswordClose()
    this.props.clearErrors()
  }
  onChange = (event) => {
    event.persist()
    this.setState(() => ({
      [event.target.name]:event.target.value
    }))
  }

  onSubmit = (event) => {
    event.preventDefault()
    const data = {
      oldPassword:this.state.oldPassword,
      newPassword:this.state.newPassword,
      newPassword2:this.state.newPassword2,
      email:this.props.authenticate.email
    }
    const  username = this.props.authenticate.username

    this.props.tempPassword(username,data,this.props.history)
    this.setState(() => ({
      oldPassword:'',
      newPassword:'',
      newPassword2:'',
      errors:{}
    }))
  }

  render () {

    const {authenticate} = this.props
    const {errors} = this.state

    let content

    if (authenticate.username === '') {
      content = <Spinner/>
    } else {
      if (authenticate.isAuthenticate === true && this.props.match.params.username === authenticate.username) {
        content = (
          <div className='private'>
            <h1>This is private page</h1>

            <div className='private__creds'>
              <img src={authenticate.avatar} alt={authenticate.username}/>
              <div className='private__creds--text'>
                <p>Name: {authenticate.name}</p>
                <p>Email: {authenticate.email}</p>
                <p>Username: {authenticate.username}</p>
                <button
                  onClick={this.modalOpen}
                  className='button__small'
                >Change password
                </button>

              </div>

            </div>
            <button
              onClick={() => {
                return this.props.deleteUser(authenticate.username,this.props.history)}
              }
              className='button-danger'
            >Delete account
            </button>

            <ChangePasswordModal
              isOpen={this.props.modal.modalChangePasswordIsOpen}
              onRequestClose={this.modalClose}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
              oldPassword={this.state.oldPassword}
              newPassword={this.state.newPassword}
              newPassword2={this.state.newPassword2}
              errorOldPassword={errors.oldPassword}
              errorNewPassword={errors.newPassword}
              errorNewPassword2={errors.newPassword2}
            />
          </div>
        )
      } else {
        return <PageNotFound/>
      }
    }


    return (
      <div className='private__content'>
        {content}
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    authenticate:state.authenticate,
    errors:state.errors,
    modal:state.modal
  }
}
export default withRouter(connect(mapStateToProps, {
  deleteUser,
  modalChangePasswordOpen,
  modalChangePasswordClose,
  tempPassword,
  clearErrors
})(PrivatePage))
