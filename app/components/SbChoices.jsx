import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
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
      expires: '05/30/2017 12:00 a.m.',
      userVote: null
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
    const hasExtra = ({info, photo, GIF, youtube, link}) => info || photo || GIF || youtube || link
    const that = this
    const isLeader = function (choice) { return didExpire(that.state.expires) && getVoteSum(that.props.choices) > 0 && choice.id === findLeader(that.props.choices).id }
    const backgrounds = ['#54D19F', '#5192E8', '#AB4DFF', '#E83442', '#FFAC59', 'coral', '#F19BA1']
    return (
        <div id='sb-choices' className='sb-choices'>
          {this.state.choices && this.state.choices.map((choice, idx) =>
            <span key={choice.id}>
              <div
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
                {/*
                <div className='right-cell' />
              </div>
              {hasExtra(choice) &&
              <div className='more-sb-info'>
                <IncludedMedia included={omit(choice, ['votes', 'title', 'id'], (val) => val !== '')} />
              */}</div>
            </span>
          )}
          <div className='box-header clearfix' id='add-tile' onClick={() => this.props.onAdd()} >
            <div className='add-title'>
              <FA name='plus' className='fa fa-fw' />
              Add a choice
            </div>
          </div>
        </div>
    )
  }
}

export default connect(state => state)(SbChoices)
