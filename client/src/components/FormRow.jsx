import React from 'react'
import { FaTimes } from 'react-icons/fa'

const FormRow = ({ type, name, value, handleChange, labelText }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      {value ? (
        <input
          id={name}
          type={type}
          value={value}
          name={name}
          onChange={handleChange}
          className="form-input"
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          onChange={handleChange}
          className="form-input"
        />
      )}
    </div>
  )
}

export default FormRow
