import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import { connect } from 'react-redux'
import * as actions from '.././actions'
import classnames from 'classnames'
import ReactModal from 'react-modal'
import ChoiceCard from './ChoiceCard'
import { createStateFromProps } from 'utilities/markupUtils'

class BallotChoiceGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      choices: [],
      userID: props.userID,
      expires: undefined,
      userVote: null,
      viewingMedia: false,
      modalOpen: null
    }
  }

  componentWillReceiveProps (nextProps) {
    let newState = createStateFromProps(this.props, nextProps)
    newState.userVote = nextProps.user.votes && nextProps.user.votes[nextProps.sb.id] ? nextProps.user.votes[nextProps.sb.id] : null
    newState.expires = nextProps.sb.expires
    this.setState(newState)
  }

  vote (e, choiceId) {
    if (e.target.className === 'extra-media-button' || e.target.className.indexOf('fa') !== -1 || e.target.className === 'youtube-video-embed') return
    const previousVote = this.props.user.votes && this.props.user.votes[this.props.sb.id] !== undefined && this.props.user.votes[this.props.sb.id] !== null ? this.props.user.votes[this.props.sb.id] : null
    this.setState({userVote: previousVote === choiceId ? null : choiceId}, function () {
      const updatedChoices = this.updateChoicesOnVote(this.props.sb.choices, choiceId, previousVote)
      this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {choices: updatedChoices}))
      this.props.dispatch(actions.startUpdateUserAll('votes', {[this.props.sb.id]: this.state.userVote}))
    })
  }

  updateChoicesOnVote (choices, newVote, previousVote) {
    return choices.map((choice) => {
      if (choice.id === previousVote) choice.votes-- // decrement previous choice's votes
      else if (choice.id === newVote && previousVote !== newVote) choice.votes++ // increment new choice's votes
      return choice
    })
  }

  render () {

    const mediaClassNames = (section) => {
      return {
        'inner-media-icon': true,
        'active': this.state.viewingSection === section
      }
    }

    const addModalIcon = (name) => {
      if (!this.state.viewingChoice[name]) return
      const iconMap = {link: 'link', youtube: 'youtube', info: 'file-text-o', /* GIF: 'film', */photo: 'photo'}
      return <div className={classnames(mediaClassNames(name))} onClick={() => this.buildModal(this.state.viewingChoice, name)} style={{marginLeft: '20px', marginBottom: '20px', display: 'inline-block'}}><FA name={iconMap[name]} className='fa fa-fw inner-media-real-icon' style={{display: 'inline-block', fontSize: '36px'}} /></div>
    }
    
    const that = this

    const buildModal = function(choice, name) {
      that.setState({modalOpen: name, [`${name}ModalOpen`]: true, viewingChoice: choice, viewingSection: name})
    }

    return (
        <span>
          <ReactModal contentLabel='delete-sb' isOpen={this.state.modalOpen !== null} className='Modal' overlayClassName='Overlay media-modal'>
            <div id='close-modal' onClick={() => this.setState({modalOpen: null})}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top'>{this.state.viewingChoice && this.state.viewingSection ? `${this.state.viewingChoice.title} - Additional Media` : null}</div>
            <span id='included-media-container'>
              <IncludedMedia included={this.state.viewingSection && this.state.viewingChoice ? {[this.state.viewingSection]: this.state.viewingChoice[this.state.viewingSection]} : {}} id={that.props.sb.id} onDelete={(type) => undefined} showDelete={false} />
            </span>
            <div id='other-media-container'>
              {this.state.viewingChoice &&
              <span>
                {addModalIcon('info')}
                {addModalIcon('photo')}
                {addModalIcon('youtube')}
                {addModalIcon('link')}
              </span>}
            </div>
          </ReactModal>
          <div id='ballot-choice-grid' className='ballot-choice-grid'>
            {this.state.choices && this.state.choices.map((choice, idx) =>
              <ChoiceCard 
                key={choice.id} 
                choice={choice}
                expires={this.state.expires}
                userID={this.props.userID}
                userVote={this.state.userVote}
                vote={(e) => this.vote(e)}
                choices={this.props.choices}
                buildModal={buildModal}
              />
            )}
            {this.props.isExtensible && <div className='box-header clearfix' id='add-tile' onClick={() => this.props.onAdd()} >
              <div className='center-cell'>
                <img className='add-tile-image' src='.././addtile.png' />
              </div>
            </div>}
          </div>
        </span>
    )
  }
}

export default connect(state => state)(BallotChoiceGrid)
