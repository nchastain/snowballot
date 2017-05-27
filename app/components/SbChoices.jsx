import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import omit from 'object.omit'
import { connect } from 'react-redux'
import * as actions from '.././actions'
import classnames from 'classnames'
import { doesExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { manipulateDOMonVote, createStateFromProps, addCommas } from 'utilities/generalUtils'

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

  componentWillReceiveProps (nextProps) {
    let newState = createStateFromProps(this.props, nextProps)
    this.setState(newState)
  }

  sbClasses (choice) {
    return classnames({
      'box-header': true,
      'clearfix': true,
      'selected': !doesExpire(this.props.expires) && choice.id === this.props.userChoice,
    })
  }

  vote (choiceId, e) {
    const DOM = manipulateDOMonVote(e, choiceId, this.props.expires, this.props.choices, this.props.userChoice)
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, DOM.updates, DOM.options))
    this.setState({voted: DOM.freshVote, userChoice: choiceId === this.state.userChoice ? '' : choiceId})
  }

  sortChoices (a, b) {
    if (this.props.sortType === 'date') return
    if (this.props.sortType === 'AZ') return b.title > a.title ? -1 : 1
    if (this.props.sortType === 'votes') return b.votes - a.votes
  }

  render () {
    const hasExtra = ({info, photo, GIF, youtube, link}) => info || photo || GIF || youtube || link
    const that = this
    const isLeader = function (choice) { return doesExpire(that.state.expires) && getVoteSum(that.props.choices) > 0 && choice.id === findLeader(that.props.choices).id }
    const backgrounds = ['#54D19F', '#5192E8', '#AB4DFF', '#E83442', '#FFAC59', 'coral', '#F19BA1']
    return (
        <div id='sb-choices' className='sb-choices'>
          {this.props.choices && this.props.choices.sort((a, b) => this.sortChoices(a, b)).map((choice, idx) =>
            <span key={choice.id}>
              <div
                key={choice.title + idx}
                className={this.sbClasses(choice)}
                onClick={(e) => !this.props.userID ? null : this.vote(choice.id, e)}
                style={{background: `${choice.photo ? `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${choice.photo})` : ''}`, backgroundSize: '40%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: backgrounds[choice.id % backgrounds.length]}}
              >
                <div className={choice.photo ? 'photo-title' : 'title'} style={{backgroundColor: `${choice.photo ? backgrounds[choice.id % backgrounds.length] : ''}`}}>{choice.title}</div>
                <span className='vote-count' style={{color: backgrounds[choice.id % backgrounds.length]}}>{addCommas(choice.votes)}</span>
                <div className='top-cell left-cell'>
                  {choice.id === this.state.userChoice && <FA name='check' className='fa fa-fw' />}
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
