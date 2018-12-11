import React from 'react'
import classNames from 'classnames'

const SelectListGroup = (
  {
    name,
    value,
    label,
    multiple,
    size,
    error,
    autofocus,
    placeholder,
    options,
    info,
    onChange,
    disabled
  }

) => {

  const selectOption = options.map((option,index) => (
    <option className='form__input--option' key={index} value={option.value}>{option.label}</option>
  ))

  return (
    <div className='form__input'>
      {error && <div className="input__invalid--feedback">{error}</div>}
      <select
        className={classNames('input__select',{'input__invalid':error})}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >{selectOption}</select>
      {info && <small className="form__info">{info}</small>}
    </div>
  )
}

export default SelectListGroup
