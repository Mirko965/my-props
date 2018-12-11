import React from 'react'
import classNames from 'classnames'

const TextAreaFieldGroup = (
  {
    name,
    placeholder,
    value,
    label,
    error,
    info,
    cols,
    rows,
    onChange,
    disabled
  }

) => {

  return (
    <div className='form__input'>
      {error && <div className="input__invalid--feedback">{error}</div>}
      <textarea
        className={classNames('input-placeholder',{'input__invalid':error})}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        cols={cols}
        rows={rows}
        disabled={disabled}
      />
      {info && <small className="form__info">{info}</small>}
    </div>
  )
}

export default TextAreaFieldGroup
