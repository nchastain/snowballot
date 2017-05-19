import React from 'react'

const FormInput = (props) => {
  const {label, value, onChange, onClick} = props
  return (
    <span id='form-input' className='edit-form'>
      <input type='text' id={`edit-${label}`} placeholder={`Enter new ${label} here`} value={value} onChange={(e) => onChange()} />
      <div className='button' onClick={() => onClick(label)}>Save</div>
    </span>
  )
}

export default FormInput
