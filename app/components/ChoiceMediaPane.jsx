import FA from 'react-fontawesome'
import classnames from 'classnames'
import React from 'react'
import Picker from 'react-giphy-picker'
import ReactPlayer from 'react-player'
import ChoiceMediaButton from './ChoiceMediaButton'

class ChoiceMediaPane extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: '',
      included: []
    }
  }

  expandSection (sectionID) {
    this.setState({ expanded: sectionID })
  }

  choiceUpdate () {

  }

  setGIF () {

  }

  createSection (id) {
    const info = (
      <div>
        <textarea
          rows={3}
          className='choice-field'
          id={`field-choice-${id}`}
          onChange={(e) => this.choiceUpdate(e, 'info')}
        />
      </div>
    )
    const photo = (
      <div>
        <div>Photo</div>
        <div className='photo-uploader' id={`photo-upload-${id}`}>
          <input type='file' className='file-input' id={`file-input-${id}`} />
          <div id={`gallery-${id}`}>
            <img className='gallery-image' id={`gallery-img-${id}`} src={this.props.choices[id - 1].imageSrc} />
          </div>
        </div>
      </div>
    )
    const youtube = (
      <div>
        <div>YouTube</div>
        <ReactPlayer url={this.props.choices[id - 1].link || 'https://www.youtube.com/watch?v=w-QXjOQjVmQ'} controls />
      </div>
    )
    const link = (
      <div>
        Link
      </div>
    )
    const GIF = (
      <div>
        <div>GIF</div>
        <Picker onSelected={this.setGIF.bind(this, id)} />
        <div className='gif-container' id={`gif-container-${id}`}>
          <img className='gif' id={`gif-${id}`} />
        </div>
      </div>
    )
    return { info, photo, youtube, link, GIF }
  }

  showExpandedSection (id) {
    const sections = this.createSection(id)
    return sections[this.state.expanded]
    ? sections[this.state.expanded]
    : null
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
      <div className={classnames(paneClasses)} id={`choice-more-info-choice-${id}`}>
        {mediaButtonSection}
        <div id='media-container'>
          {this.showExpandedSection(id)}
        </div>
      </div>
    )
  }
}

export default ChoiceMediaPane
