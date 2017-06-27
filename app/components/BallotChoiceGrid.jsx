import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'
import omit from 'object.omit'
import { connect } from 'react-redux'
import * as actions from '.././actions'
import classnames from 'classnames'
import ReactModal from 'react-modal'
import ReactPlayer from 'react-player'
import NewBallotChoice from './NewBallotChoice'
import ChoiceCard from './ChoiceCard'
import { didExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { createStateFromProps, addCommas } from 'utilities/generalUtils'

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

  vote (choiceId, e) {
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

  buildModal (choice, name) {
    this.setState({modalOpen: name, [`${name}ModalOpen`]: true, viewingChoice: choice, viewingSection: name})
  }

  render () {
    const backgrounds = ['#54D19F', '#5192E8', '#DE80FF', '#E83442', '#FFAC59', 'coral', '#F19BA1']
    
    const lightBackgrounds = ['#87FFD2', '#84C5FF', '#FFD1FF', '#FF6775', '#FFDF8C', '#FFB283', '#FFCED4']
    
    const mediaIcon = (name, icon, choice) => {
      return (
        <span>
          {choice[name] && <span className='icon-wrapper'>
            <span className={`icon-${name}`} id={`icon-${name}-${choice.id}`} onClick={() => this.buildModal(choice, name)}>
              <span>{choice[name] && <span className='extra-media-button' style={{color: 'white', backgroundColor: lightBackgrounds[choice.id % lightBackgrounds.length]}} data-tip data-for={`${name}-tooltip-${choice.id}`}><FA name={icon} className='fa fa-fw' /></span>}</span>
              <ReactTooltip id={`${name}-tooltip-${choice.id}`} effect='solid'><span>View {name === 'youtube' ? 'YouTube link' : name}</span></ReactTooltip>
            </span>
          </span>}
        </span>
      )
    }
    
    const hasExtraMedia = choice => choice.photo || choice.info || choice.link || choice.youtube

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

    return (
        <span style={{display: 'inline-block'}}>
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
                vote={(e) => this.vote(choiceID, e)}
                choices={this.props.choices}
                // buildModal={function(choice, name) { that.setState({modalOpen: name, [`${name}ModalOpen`]: true, viewingChoice: choice, viewingSection: name}) }}
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
