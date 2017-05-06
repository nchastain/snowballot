import classnames from 'classnames'
import React from 'react'
import Picker from 'react-giphy-picker'
import ChoiceMediaButton from './ChoiceMediaButton'
import IncludedMedia from './IncludedMedia'
import * as actions from '.././actions'
import { connect } from 'react-redux'

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

  setGIF () { }

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

  addLink (url) {
    this.setState({youtube: url})
  }

  createSection () {
    const info = (
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
        <div className='button button-save' onClick={(e) => this.saveSection('info')}>Save</div>
      </span>
      )
    const photo = (
      <span>
        <div className='choice-photo-uploader' id={`photo-upload-${this.props.id}`}>
          <input type='file' className='choice-file-input' id={`file-input-${this.props.id}`} onChange={() => this.previewImage()} />
          <div id={`gallery-${this.props.id}`}>
            <img className={this.state.photo ? 'gallery-image' : 'gallery-image hidden'} id={`gallery-img-${this.props.id}`} src={this.state.photo} />
          </div>
        </div>
        {this.state.photo && <div className='button button-save' onClick={() => this.saveSection('photo')}>Save</div>}
      </span>
      )
    const youtube = (
      <div>
        <input type='text' className='link-input' placeholder='Paste a YouTube link here' onChange={(e) => this.addLink(e.target.value)} />
        <div className='button button-save' onClick={() => this.saveSection('youtube')}>Save</div>
      </div>
      )
    const link = (
      <div>
        Link
        <div className='button button-save' onClick={() => this.saveSection('link', 'something here')}>Save</div>
      </div>
      )
    const GIF = (
      <div>
        <div>GIF</div>
        <Picker onSelected={this.setGIF.bind(this, this.props.id)} />
        <div className='gif-container' id={`gif-container-${this.props.id}`}>
          <img className='gif' id={`gif-${this.props.id}`} />
        </div>
        <div className='button button-save' onClick={() => this.saveSection('GIF', 'something here')}>Save</div>
      </div>
      )
    return { info, photo, youtube, link, GIF }
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
      <span>
        <div className={classnames(paneClasses)} id={`choice-more-info-choice-${this.props.id}`}>
          {mediaButtonSection}
          {this.showExpanded()}
        </div>
        <IncludedMedia included={this.state.included} />
      </span>
    )
  }
}

export default connect(state => state)(ChoiceMediaPane)
