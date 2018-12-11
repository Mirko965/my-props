import React from 'react'
import classNames from 'classnames'



const InputGroup = (
  {
    name,
    placeholder,
    value,
    label,
    error,
    icon,
    info,
    type = 'text',
    onChange,
    disabled
  }

) => {

  return (
    <div className='form__input--social'>
      <img src={icon} className='icon' alt='icon'/>
      <input
        type={type}
        className={classNames('input__social',{'input__invalid':error})}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <div className="input__invalid--feedback">{error}</div>}
    </div>
  )
}

export default InputGroup
