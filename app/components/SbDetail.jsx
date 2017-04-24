import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import Redux from 'redux'
import moment from 'moment'
import classnames from 'classnames'

let createHandlers = function (dispatch) {
  let updateSb = function (id, choiceId, updatedSb, fresh) {
    dispatch(actions.startUpdateSb(id, choiceId, updatedSb, fresh))
  }
  let findSb = function (alias) {
    dispatch(actions.findSb(alias))
  }
  return {
    updateSb,
    findSb
  }
}

let setDOMReferences = function (e) {
  const plusText = document.querySelector('.box-header.selected .plus')
  const voteCount = document.querySelector('.box-header.selected .vote-count')
  const selected = e.currentTarget.className.indexOf('selected') !== -1
  return {selected, plusText, voteCount}
}

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    let voted = this.props.sb.userChoice
    let votedChoiceId = this.props.sb.userVoted
    let expired = false
    if (typeof this.props.sb.expires === 'string') expired = moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
    this.state = {
      voted: voted,
      votedChoiceId: votedChoiceId,
      expired: expired
    }
    this.handlers = createHandlers(this.props.dispatch)
    this.sbClasses = this.sbClasses.bind(this)
  }

  componentDidMount () {
    this.handlers.findSb(this.props.match.params.alias)
  }

  componentWillReceiveProps (nextProps) {
    let expired = false
    if (nextProps.sb) {
      expired = nextProps.sb.expires && moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
    }
    if (nextProps.sb && nextProps.sb.userVoted && nextProps.sb.userChoice) {
      let voted = nextProps.sb.userVoted
      let votedChoiceId = nextProps.sb.userChoice
      this.setState({voted: voted, votedChoiceId: votedChoiceId, expired: expired})
    }
  }

  vote (e, choiceId) {
    let oldDOMRefs = setDOMReferences(e)
    const {selected, plusText, voteCount} = oldDOMRefs
    let expired = this.props.sb.expires && moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
    if (expired) {
      this.setState({expired: true})
      return
    }
    if (!selected) {
      e.currentTarget.querySelector('.selection-icon.selected').style.display = 'inline-block'
      e.currentTarget.querySelector('.selection-icon.unselected').style.display = 'none'
    }
    if (selected) {
      e.currentTarget.querySelector('.selection-icon.selected').style.display = 'none'
      e.currentTarget.querySelector('.selection-icon.unselected').style.display = 'inline-block'
    }
    if (plusText && voteCount) {
      plusText.style.visibility = 'hidden'
      plusText.style.opacity = '0'
      voteCount.style.marginRight = '-35px'
    } else if (plusText && voteCount) {
      plusText.style.visibility = 'visible'
      plusText.style.opacity = '1'
      voteCount.style.marginRight = '10px'
    }
    let freshVote
    var updatedChoices = this.props.sb.choices.map((choice) => {
      if (choice.id === choiceId) {
        if (choiceId === this.props.sb.userChoice) {
          choice.votes--
          freshVote = false
        } else {
          choice.votes++
          freshVote = true
        }
      }
      return choice
    })
    var updatedSb = {
      ...this.props.sb,
      userVoted: freshVote,
      userChoice: freshVote ? choiceId : null,
      choices: updatedChoices
    }
    this.handlers.updateSb(this.props.sb.id, choiceId, updatedSb, freshVote)
    this.setState({voted: freshVote, votedChoiceId: freshVote ? choiceId : ''})
  }

  sbClasses (choice) {
    return classnames({
      'box-header': true,
      'clearfix': true,
      'selected': !this.state.expired && choice.id === this.props.sb.userChoice,
      'leader': this.state.expired && choice.id === this.findLeader(this.props.sb.choices).id
    })
  }

  renderSelectedChoice (choice) {
    return choice.id === this.state.votedChoiceId
    ? <span>
        <span
          className='circle-full selected'
        >
          <FA name='check-circle' />
        </span>
        <span
          className='circle not-selected'
        >
          <FA name='circle-o' />
        </span>
      </span>
    : <span>
        <span
          className='circle'
        >
          <FA name='circle-o' />
        </span>
        <span
          className='circle-full'
        >
          <FA name='check-circle' />
        </span>
      </span>
  }

  hoverVote (e) {
    if (!this.props.user.uid || this.state.expired) return
    let DOMRefs = setDOMReferences(e)
    const {selected, plusText, voteCount} = DOMRefs
    const offset = 10
    const show = `-${offset}px`
    const hide = `-${offset + 25}px`
    const currentVoteCount = e.currentTarget.querySelector('.vote-count')
    const currentPlus = e.currentTarget.querySelector('.plus')
    const currentContainer = e.currentTarget
    if (e.type === 'mouseenter') {
      currentVoteCount.style.marginRight = show
      currentPlus.style.visibility = 'visible'
      currentPlus.style.opacity = '1'
      currentContainer.style.cursor = 'pointer'
      currentContainer.style.backgroundColor = '#bfe6ff'
    } else if (e.type === 'mouseleave') {
      currentVoteCount.style.marginRight = hide
      currentPlus.style.visibility = 'hidden'
      currentPlus.style.opacity = '0'
      currentContainer.style.backgroundColor = selected ? '#bfe6ff' : 'white'
    }
    if (plusText && voteCount) {
      if (e.type === 'mouseenter') {
        plusText.style.visibility = 'visible'
        plusText.style.opacity = '1'
        voteCount.style.marginRight = show
      } else if (e.type === 'mouseleave') {
        plusText.style.visibility = 'hidden'
        plusText.style.opacity = '0'
        voteCount.style.marginRight = hide
      }
    }
  }

  findLeader (choices) {
    let most = 0
    let leader = null
    choices.forEach(function (choice) {
      if (choice.votes > most) {
        most = choice.votes
        leader = choice
      }
    })
    return leader
  }

  renderCreatorMessage () {
    return moment.unix(this.props.sb.createdAt).subtract(1, 'hours').isBefore(moment().unix())
    ? <div className='creator-message'>
        <span className='creator-message-text'>
        You just created this snowballot! Now <a href={`/sbs/${this.props.sb.alias}`}>send it to people</a> and bask in the wisdom of crowds.
        </span>
      </div>
    : <div className='creator-message'>
      <span className='creator-message-text'>
      You created this snowballot on {moment.unix(this.props.sb.createdAt).format('dddd, MMMM Do, YYYY')}
      </span>
      </div>
  }

  renderAuthMessage () {
    return this.props.user.uid
    ? null
    : <div className='please-login-message'>
        <FA name='warning' />
        <span className='login-message-text'>
        To vote on this, <Link to='/login'>log</Link> in or <Link to='/register'>register</Link>. It's how we stop stage moms from rigging children's beauty pageants.</span>
      </div>
  }

  renderExpiresMessage () {
    return (
      <span className='expiration-info'>
        <FA name='clock-o' className='fa fa-fw' />This snowballot {this.state.expired ? 'has expired.' : `expires after ${this.props.sb.expires}` }
      </span>
    )
  }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0) return
    return (
      <div>
        <h4 className='sb-title'>{this.props.sb.title}</h4>
        <ul className='sb-choices'>
          {this.props.sb.choices.map((choice, idx) =>
            <div
              key={choice.title + idx}
              className={this.sbClasses(choice)}
              onClick={(e) => !this.props.user.uid ? null : this.vote(e, choice.id)}
              onMouseEnter={(e) => this.hoverVote(e)}
              onMouseLeave={(e) => this.hoverVote(e)}
            >
              <div className='left-cell'>
                <FA className='fa-fw selection-icon unselected' name='circle-o' />
                <FA className='fa-fw selection-icon selected' name='check-circle' />
                <FA className='fa-fw selection-icon trophy' name='trophy' />
              </div>
              <div className='right-cell'>
                <li key={this.props.sb.id + choice.title + idx}>{choice.title}</li>
              </div>
              <div className='right-cell'>
                <span className='vote-count'>{choice.votes} votes {choice.id === this.props.sb.userChoice ? <span className='plus selected'> - 1?</span> : <span className='plus'> + 1?</span>}</span>
              </div>
            </div>
          )}
        </ul>
      </div>
    )
  }

  render () {
    return (
      <div>
        <div className='above-sb-container'>
          {this.props.sb.expires && this.renderExpiresMessage()}
          {this.props.user.uid === this.props.sb.creator && this.renderCreatorMessage()}
          {this.renderAuthMessage()}
        </div>
        <div className='alert-container'>
          <span className={this.state.voted ? 'status-message voted' : 'status-message'}>{this.state.voted ? <span>thank you for contributing to this snowballot!</span> : <span>Nevermind!</span>}</span>
        </div>
        <div className='snowballots-section'>
          {this.renderSb()}
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
