import React, { Component } from 'react'
import head_image from '../common/icons-img/head_image.jpg'

class Landing extends Component {

  render () {
    return (
      <div className='landing'>
        <div className='landing__header'>
          <h1>Developer Proposal</h1>
          <p> Create a web  with React,Redux,Node,Express and MongoDB</p>
        </div>

        <div className='landing__image'>
          <img src={head_image} alt='head_image'/>
        </div>
      </div>
    )
  }
}

export default Landing
