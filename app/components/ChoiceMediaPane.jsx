import classnames from 'classnames'
import React from 'react'
import Picker from 'react-giphy-picker'
import ChoiceMediaButton from './ChoiceMediaButton'
import IncludedMedia from './IncludedMedia'
import * as actions from '.././actions'
import { connect } from 'react-redux'
import omit from 'object.omit'
import FA from 'react-fontawesome'

class ChoiceMediaPane extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: '',
      included: {},
      id: props.id
    }
  }

  expandSection (sectionID) {
    const toExpand = this.state.expanded === sectionID ? '' : sectionID
    this.setState({ expanded: toExpand, [sectionID]: '' })
  }

  saveSection (section) {
    const newIncluded = Object.assign({}, this.state.included, {[section]: this.state[section]})
    const newState = section === 'photoFile' ? {included: newIncluded} : {[section]: '', expanded: '', included: newIncluded}
    this.setState(newState)
    this.props.dispatch(actions.updateCreatedSb(this.props.id, newIncluded))
  }

  previewImage () {
    const that = this
    const file = document.querySelector(`#file-input-${this.props.id}`).files[0]
    this.setState({photoFile: file}, function () {
      that.saveSection('photoFile')
    })
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      that.setState({photo: e.target.result, photoFile: file})
    }
  }

  createSection () {
    const linkInput = (placeholder, type) => <input type='text' className='link-input' placeholder={placeholder} onChange={(e) => this.setState({[type]: e.target.value})} />
    const saveButton = (sectionToSave) => <div className='button button-save' onClick={(e) => this.saveSection(sectionToSave)}>Save</div>
    const sections = {}

    sections.info = (
      <span>
        <div id='choice-info-expanded'>
          <textarea
            rows={3}
            className='choice-field'
            id={`field-choice-${this.props.id}`}
            value={this.state.info}
            onChange={(e) => this.setState({info: e.target.value})}
          />
        </div>
        {saveButton('info')}
      </span>
    )

    sections.photo = (
      <span>
        <div className='choice-photo-uploader' id={`photo-upload-${this.props.id}`}>
          <input type='file' className='choice-file-input' id={`file-input-${this.props.id}`} onChange={() => this.previewImage()} style={{display: 'none'}} />
          {!this.state.photo && <div id='upload-button' onClick={() => document.getElementById(`file-input-${this.props.id}`).click()}><FA name='upload' className='fa fa-fw' />Upload a file</div>}
          <div className='choice-gallery' id={`gallery-${this.props.id}`}>
            <img className={this.state.photo ? 'gallery-image' : 'gallery-image hidden'} id={`gallery-img-${this.props.id}`} src={this.state.photo} />
          </div>
        </div>
        {this.state.photo && saveButton('photo')}
      </span>
    )

    sections.youtube = (
      <div>
        {linkInput('Paste a YouTube link here', 'youtube')}
        {saveButton('youtube')}
      </div>
    )

    sections.link = (
      <div>
        {linkInput('Paste a link here', 'link')}
        {saveButton('link')}
      </div>
    )

    sections.GIF = (
      <div>
        <Picker onSelected={(e) => this.setState({GIF: e.downsized.url})} />
        <div className='gif-container' id={`gif-container-${this.props.id}`}>
          <img className={this.state.GIF ? 'gallery-image selected-GIF' : 'gallery-image hidden'} id={`gif-${this.props.id}`} src={this.state.GIF} />
        </div>
        {this.state.GIF && saveButton('GIF')}
      </div>
    )

    return sections
  }

  deleteIncluded (type) {
    const newIncluded = omit(this.state.included, type)
    this.setState({included: newIncluded}, () => this.props.dispatch(actions.updateCreatedSb(this.props.id, newIncluded)))
  }

  showIncluded () {
    const includedSections = Object.keys(this.state.included)
    return includedSections.map(iS => <div key={iS}>{iS}</div>)
  }

  showExpanded () {
    const sections = this.createSection()
    const inner = sections[this.state.expanded]
    if (inner) return <div id='media-container'>{inner}</div>
  }

  render () {
    const that = this
    const mediaButtons = [
      {icon: 'commenting-o', label: 'add info', id: 'info'},
      {icon: 'photo', label: 'add photo', id: 'photo'},
      {icon: 'youtube', label: 'add YouTube video', id: 'youtube'},
      {icon: 'link', label: 'add link', id: 'link'},
      {icon: 'film', label: 'add GIF', id: 'GIF'}
    ]
    const paneClasses = {'choice-media-pane': true, 'choice-more-info': true, 'expanded': this.props.choiceExpanded}
    const mediaButtonSection = mediaButtons.map(function (mB) {
      const { id, icon, label } = mB
      return <ChoiceMediaButton key={id} iconName={icon} label={label} clickHandler={() => that.expandSection(id)} />
    })
    return (
      <span id='choice-media-pane'>
        <div className={classnames(paneClasses)} id={`choice-more-info-choice-${this.props.id}`}>
          {mediaButtonSection}
          {this.showExpanded()}
        </div>
        <IncludedMedia included={this.state.included} id={this.props.id} onDelete={(type) => this.deleteIncluded(type)} />
      </span>
    )
  }
}

export default connect(state => state)(ChoiceMediaPane)
