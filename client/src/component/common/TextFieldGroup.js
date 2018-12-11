import React from 'react'
import classNames from 'classnames'

const TextFieldGroup = (
  {
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type = 'text',
    onChange,
    disabled
  }

) => {

  return (
    <div className='form__input'>
      {error && <div className="input__invalid--feedback">{error}</div>}
      <input
        type={type}
        className={classNames('input',{'input__invalid':error})}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {info && <small className="form__info">{info}</small>}

    </div>
  )
}

export default TextFieldGroup
