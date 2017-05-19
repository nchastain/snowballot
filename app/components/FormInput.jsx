import React from 'react'

const FormInput = ({label, value, onChange, onClick}) => (
  <span id='form-input' className='edit-form'>
    <input type='text' id={`edit-${label}`} placeholder={`Enter new ${label} here`} value={value} onChange={(e) => onChange()} />
    <div className='button' onClick={() => onClick(label)}>Save</div>
  </span>
)

export default FormInput
