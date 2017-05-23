import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import omit from 'object.omit'
import { connect } from 'react-redux'
import * as actions from '.././actions'
import classnames from 'classnames'
import { doesExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { handleVoteHover, manipulateDOMonVote } from 'utilities/generalUtils'

class SbChoices extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      choices: this.props.choices,
      userID: this.props.userID,
      expires: this.props.expires,
      userChoice: this.props.userChoice
    }
  }

  sbClasses (choice) {
    return classnames({
      'box-header': true,
      'clearfix': true,
      'selected': !doesExpire(this.props.expires) && choice.id === this.props.userChoice,
      'leader': doesExpire(this.props.expires) && getVoteSum(this.props.choices) && choice.id === findLeader(this.props.choices).id
    })
  }

  vote (choiceId, e) {
    const DOM = manipulateDOMonVote(e, choiceId, this.props.expires, this.props.choices, this.props.userChoice)
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, DOM.updates, DOM.options))
    this.setState({voted: DOM.freshVote, votedChoiceId: DOM.freshVote ? choiceId : ''})
  }

  render () {
    const hasExtra = ({info, photo, GIF, youtube, link}) => info || photo || GIF || youtube || link
    const iconInfo = [{class: 'unselected', name: 'circle-o'}, {class: 'selected', name: 'check-circle'}, {class: 'trophy', name: 'trophy'}]
    return (
      <ul className='sb-choices'>
        {this.props.choices && this.props.choices.map((choice, idx) =>
          <span key={choice.id}>
            <div
              key={choice.title + idx}
              className={this.sbClasses(choice)}
              onClick={(e) => !this.props.userID ? null : this.vote(choice.id, e)}
              onMouseEnter={(e) => handleVoteHover(e, this.props.userID, this.props.expires)}
              onMouseLeave={(e) => handleVoteHover(e, this.props.userID, this.props.expires)}
            >
              <div className='left-cell'>
                {iconInfo.map((icon) => <FA key={icon.name} className={`fa-fw selection-icon ${icon.class}`} name={icon.name} />)}
              </div>
              <div className='right-cell'>
                <li>{choice.title}</li>
              </div>
              <div className='right-cell'>
                <span className='vote-count'>{choice.votes} votes {choice.id === this.props.userChoice ? <span className='plus selected'> - 1?</span> : <span className='plus'> + 1?</span>}</span>
              </div>
            </div>
            {hasExtra(choice) &&
            <div className='more-sb-info'>
              <IncludedMedia included={omit(choice, ['votes', 'title', 'id'], (val) => val !== '')} />
            </div>}
          </span>
        )}
      </ul>
    )
  }
}

export default connect(state => state)(SbChoices)
