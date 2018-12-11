import React, { Component } from 'react'

class Footer extends Component {
  render () {
    return (
      <footer className='footer'>
        <p>Copyright &copy; {new Date().getFullYear()}</p>
      </footer>
    )
  }
}
export default Footer
