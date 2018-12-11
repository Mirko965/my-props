import React from 'react'
import spinner from './icons-img/Spin-1s-200px.gif'

const Spinner = () => {
  return (
    <div>
      <img
        src={spinner}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  )
}

export default Spinner
