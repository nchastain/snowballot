import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'
import omit from 'object.omit'
import { connect } from 'react-redux'
import * as actions from '.././actions'
import classnames from 'classnames'
import { didExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { createStateFromProps, addCommas } from 'utilities/generalUtils'

class SbChoices extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      choices: [],
      userID: props.userID,
      expires: undefined,
      userVote: null,
      viewingMedia: false
    }
  }

  componentWillReceiveProps (nextProps) {
    let newState = createStateFromProps(this.props, nextProps)
    newState.userVote = nextProps.user.votes && nextProps.user.votes[nextProps.sb.id] ? nextProps.user.votes[nextProps.sb.id] : null
    this.setState(newState)
  }

  sbClasses (choice) {
    return classnames({
      'box-header': true,
      'clearfix': true
    })
  }

  vote (choiceId, e) {
    if (e.target.className === 'extra-media-button' || e.target.className.indexOf('fa') !== -1) return
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
    const backgrounds = ['#54D19F', '#5192E8', '#DE80FF', '#E83442', '#FFAC59', 'coral', '#F19BA1']
    const lightBackgrounds = ['#87FFD2', '#84C5FF', '#FFD1FF', '#FF6775', '#FFDF8C', '#FFB283', '#FFCED4']
    const mediaIcon = (name, icon, choice) => {
      return (
        <span id={`icon-${name}-${choice.id}`} onClick={() => console.log(name)}>
          <span>{choice[name] && <span className='extra-media-button' style={{color: 'white', backgroundColor: lightBackgrounds[choice.id % lightBackgrounds.length]}} data-tip data-for={`${name}-tooltip-${choice.id}`}><FA name={icon} className='fa fa-fw' /></span>}</span>
          <ReactTooltip id={`${name}-tooltip-${choice.id}`} effect='solid'><span>View {name === 'youtube' ? 'YouTube link' : name}</span></ReactTooltip>
        </span>
      )
    }
    const addExtraMedia = (choice) => {
      return (
        <span>
          {mediaIcon('info', 'file-text-o', choice)}
          {mediaIcon('photo', 'picture-o', choice)}
          {mediaIcon('youtube', 'youtube', choice)}
          {mediaIcon('link', 'link', choice)}
          {mediaIcon('GIF', 'film', choice)}
        </span>
      )
    }
    const that = this
    const isLeader = function (choice) { return didExpire(that.state.expires) && getVoteSum(that.props.choices) > 0 && choice.id === findLeader(that.props.choices).id }
    return (
        <div id='sb-choices' className='sb-choices'>
          {this.state.choices && this.state.choices.map((choice, idx) =>
            <span key={choice.id}>
              <div
                id={`choice-container-${choice.id}`}
                key={choice.title + idx}
                className={this.sbClasses(choice)}
                onClick={(e) => !this.props.userID || didExpire(this.state.expires) ? null : this.vote(choice.id, e)}
                style={{background: `${choice.photo ? `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${choice.photo})` : ''}`, backgroundSize: '40%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: backgrounds[choice.id % backgrounds.length]}}
              >
                <div className={choice.photo ? 'photo-title' : 'title'} style={{backgroundColor: `${choice.photo ? backgrounds[choice.id % backgrounds.length] : ''}`}}>{choice.title}</div>
                <span className='vote-count' style={{color: backgrounds[choice.id % backgrounds.length]}}>{addCommas(choice.votes)}</span>
                <div className='top-cell left-cell'>
                  {choice.id === this.state.userVote && <FA name='check' className='fa fa-fw' />}
                </div>
                <div className='top-cell right-cell'>
                  {isLeader(choice) && <FA name='trophy' className='fa fa-fw' />}
                </div>
                <div className='bottom-left-cell'>
                  {addExtraMedia(choice)}
                </div>
              </div>
            </span>
          )}
          {this.props.isExtensible && <div className='box-header clearfix' id='add-tile' onClick={() => this.props.onAdd()} >
            <div className='add-title'>
              <FA name='plus' className='fa fa-fw' />
              Add a choice
            </div>
          </div>}
        </div>
    )
  }
}

export default connect(state => state)(SbChoices)
