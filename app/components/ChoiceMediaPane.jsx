import FA from 'react-fontawesome'
import classnames from 'classnames'
import React from 'react'
import Picker from 'react-giphy-picker'
import ReactPlayer from 'react-player'
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
    this.setState({ expanded: toExpand })
  }

  setGIF () { }

  saveSection (section) {
    const newIncluded = Object.assign({}, this.state.included, {[section]: this.state[section]})
    this.setState({[section]: '', expanded: '', included: newIncluded})
    this.props.dispatch(actions.updateCreatedSb(this.props.id, newIncluded))
  }

  createSection (id) {
    const info = (
      <span>
        <div id='choice-info-expanded'>
          <textarea
            rows={3}
            className='choice-field'
            id={`field-choice-${id}`}
            value={this.state.info}
            onChange={(e) => this.setState({info: e.target.value})}
          />
        </div>
        <div className='button button-save' onClick={(e, id) => this.saveSection('info')}>Save</div>
      </span>
    )
    const photo = (
      <div>
        <div>Photo</div>
        <div className='choice-photo-uploader' id={`photo-upload-${id}`}>
          <input type='file' className='file-input' id={`file-input-${id}`} />
          <div id={`gallery-${id}`}>
            <img className='gallery-image' id={`gallery-img-${id}`} src={this.props.choices[id - 1].imageSrc} />
          </div>
        </div>
        <div className='button button-save' onClick={() => this.saveSection('photo')}>Save</div>
      </div>
    )
    const youtube = (
      <div>
        <div>YouTube</div>
        <ReactPlayer url={this.props.choices[id - 1].link || 'https://www.youtube.com/watch?v=w-QXjOQjVmQ'} controls />
        <div className='button button-save' onClick={() => this.saveSection('youtube', 'something here')}>Save</div>
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
        <Picker onSelected={this.setGIF.bind(this, id)} />
        <div className='gif-container' id={`gif-container-${id}`}>
          <img className='gif' id={`gif-${id}`} />
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

  showExpanded (id) {
    const sections = this.createSection(id)
    const inner = sections[this.state.expanded]
    if (inner) return <div id='media-container'>{inner}</div>
  }

  render () {
    const that = this
    const { id } = this.props
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
      return (
        <ChoiceMediaButton
          key={id}
          iconName={icon}
          label={label}
          clickHandler={() => that.expandSection(id)}
        />
      )
    })
    return (
      <span>
        <div className={classnames(paneClasses)} id={`choice-more-info-choice-${id}`}>
          {mediaButtonSection}
          {this.showExpanded(id)}
        </div>
        <IncludedMedia included={this.state.included} />
      </span>
    )
  }
}

export default connect(state => state)(ChoiceMediaPane)
