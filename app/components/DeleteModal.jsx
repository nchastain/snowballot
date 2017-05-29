import React from 'react'
import FA from 'react-fontawesome'
import ReactModal from 'react-modal'
import { modalStyles } from 'utilities/generalUtils'
import { Link } from 'react-router-dom'

const DeleteModal = (props) => {
  const { toggle, showModal, deleteConfirm } = props
  return (
    <div id='delete-modal' className='action-button delete-button button' onClick={() => toggle()}>
      <FA name='trash' className='fa fa-fw' />
      <ReactModal contentLabel='delete-sb' isOpen={showModal} style={modalStyles} >
        <div id='modal-content'>
          <div id='modal-top'>
            <div id='close-modal' onClick={() => toggle()}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            Delete this snowballot?
          </div>
          <div id='delete-choices'>
            <div id='delete-confirm' className='button' onClick={() => deleteConfirm()}>Delete</div>
            <div id='delete-cancel' className='button' onClick={() => toggle()}>Cancel</div>
            <Link to='/' id='link-following-deletion' style={{display: 'none'}} />
          </div>
        </div>
      </ReactModal>
    </div>
  )
}

export default DeleteModal