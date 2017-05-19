import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import { doesExpire, findLeader, getVoteSum } from 'utilities/sbUtils'
import { manipulateDOMonVote, handleVoteHover } from 'utilities/generalUtils'
import omit from 'object.omit'

const SbChoices = (choices, expires, userChoice, userID) => {
  const vote = function (e, choiceId) {
    if (this.props.user.uid) return
    const DOM = manipulateDOMonVote(e, choiceId, this.state.expires, this.props.sb.choices, this.props.sb.userChoice)
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, DOM.updates, DOM.options))
    this.setState({voted: DOM.freshVote, votedChoiceId: DOM.freshVote ? choiceId : ''})
  }

  const hoverVote = function (e) {
    if (!userID || doesExpire(expires)) return
    handleVoteHover(e)
  }

  const addChoice = function () {
    if (doesExpire(this.state.expires)) this.setState({error: 'Sorry, this snowballot has expired!'})
    const choiceNames = this.props.sb.choices.map(choice => choice.title.toLowerCase())
    if (choiceNames.indexOf(this.state.newChoice.toLowerCase()) !== -1) this.setState({error: 'Sorry, that choice already exists!'})
    else {
      const choice = {
        title: this.state.newChoice,
        votes: 0,
        id: this.props.sb.choices.length + 1
      }
      const options = {}
      this.handlers.updateSb(this.props.sb.id, {choices: [...this.props.sb.choices, choice]}, options)
      this.setState({newChoice: ''})
    }
  }

  const handleAddChoiceChange = function (e) {
    const code = (e.keyCode ? e.keyCode : e.which)
    this.setState({error: ''})
    if (code === 13) {  // Enter keycode
      const choiceNames = this.props.sb.choices.map(choice => choice.title.toLowerCase())
      if (choiceNames.indexOf(this.state.newChoice.toLowerCase()) !== -1) this.setState({error: 'Sorry, that choice already exists!'})
      else addChoice()
    }
    this.setState({newChoice: e.target.value})
  }

  const showAddChoice = function () {
    const extensibleOrCreated = this.props.sb.isExtensible || isCreator(this.props.user.uid, this.props.sb.creator)
    if (extensibleOrCreated && this.props.user.uid && !doesExpire(this.state.expires)) return
    return (
      <span>
        <input
          id='detail-add-input'
          type='text' placeholder='Start typing a new choice here.'
          onChange={(e) => handleAddChoiceChange(e)}
          onKeyDown={(e) => handleAddChoiceChange(e)}
          value={this.state.newChoice}
        />
        <div
          id='detail-add-choice'
          className='button secondary'
          onClick={() => this.addChoice()}
        >
          <FA name='plus' className='fa fa-fw' />
          add choice
        </div>
        {this.state.error ? <div className='error-message'>{this.state.error}</div> : null}
      </span>
    )
  }

  const iconInfo = [{class: 'unselected', name: 'circle-o'}, {class: 'selected', name: 'check-circle'}, {class: 'trophy', name: 'trophy'}]
  const sbClasses = function (choice) {
    return classnames({
      'box-header': true,
      'clearfix': true,
      'selected': !doesExpire(expires) && choice.id === userChoice,
      'leader': doesExpire(expires) && getVoteSum(choices) && choice.id === findLeader(choices).id
    })
  }
  const hasExtra = ({info, photo, GIF, youtube, link}) => info || photo || GIF || youtube || link
  return (
    <ul className='sb-choices'>
      {choices.map((choice, idx) =>
        <span key={choice.id}>
          <div key={choice.title + idx} className={sbClasses(choice)} onClick={(e) => vote(e, choice.id)} onMouseEnter={(e) => hoverVote(e)} onMouseLeave={(e) => hoverVote(e)}>
            <div className='left-cell'>
              {iconInfo.map((icon) => <FA key={icon.name} className={`fa-fw selection-icon ${icon.class}`} name={icon.name} />)}
            </div>
            <div className='right-cell'>
              <li>{choice.title}</li>
            </div>
            <div className='right-cell'>
              <span className='vote-count'>{choice.votes} votes {choice.id === userChoice ? <span className='plus selected'> - 1?</span> : <span className='plus'> + 1?</span>}</span>
            </div>
          </div>
          {hasExtra(choice) &&
          <div className='more-sb-info'>
            <IncludedMedia included={omit(choice, ['votes', 'title', 'id'], (val) => val !== '')} />
          </div>}
        </span>
      )}
      {showAddChoice()}
    </ul>
  )
}

export default SbChoices
