import React, {Component} from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import TextFieldGroup from '../common/TextFieldGroup'
import { modalForgotPasswordOpen, modalLoginClose } from '../actions/modalAction'



class LoginModal extends Component {
  openForgotPasswordModal = () => {
    this.props.modalLoginClose()
    this.props.modalForgotPasswordOpen()
  }
  render () {
    return (
      <div>
        <Modal
          overlayClassName='login__modal--overlay'
          isOpen={this.props.isOpen}
          onRequestClose={this.props.onRequestClose}
          closeTimeoutMS={300}
          className='login__modal'
          contentLabel="Login Modal"
          appElement={document.getElementById('root')}
        >
          <div className='form'>
            <h1>Log In</h1>
            {this.props.errors.mongodb ? <p className='errorText'>{this.props.errors.mongodb}</p> : <p>Sign in to your account</p>}

            <form className='form__input' onSubmit={this.props.onSubmit}>
              <TextFieldGroup
                placeholder="Email Address"
                name="email"
                type="email"
                value={this.props.email}
                onChange={this.props.onChange}
                error={this.props.errors.email}
              />
              <TextFieldGroup
                placeholder="Password"
                name="password"
                type="password"
                value={this.props.password}
                onChange={this.props.onChange}
                error={this.props.errors.password}
              />
              <button
                className='button__forgot--password'
                type='button'
                onClick={this.openForgotPasswordModal}
              >Forgot  password ???
              </button>
              <button className='form__input--button'>Submit</button>
            </form>

          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal:state.modal
  }
}
export default connect(mapStateToProps,{modalForgotPasswordOpen,modalLoginClose})(LoginModal)
