import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import Redux from 'redux'
import moment from 'moment'
import classnames from 'classnames'
import SharePanel from './SharePanel'
import { imagesRef } from '../firebase/constants'

let createHandlers = function (dispatch) {
  let updateSb = function (id, updates, options) {
    dispatch(actions.startUpdateSb(id, updates, options))
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
  const votedBox = document.querySelector('.box-header.selected')
  return {selected, votedBox, plusText, voteCount}
}

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    let voted = this.props.sb.userChoice
    let votedChoiceId = this.props.sb.userVoted
    let expired = false
    if (typeof this.props.sb.expires === 'string') expired = moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
    this.state = {
      newChoice: '',
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
    let voted = false
    let votedChoiceId = ''
    if (nextProps.sb) {
      if (typeof nextProps.sb.expires === 'string') expired = moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
      if (nextProps.sb.choices && nextProps.sb.choices.length !== 0 && nextProps.sb.privateAlias && nextProps.sb.privateAlias !== '') this.updateSbImages(nextProps)
    }
    if (nextProps.sb && nextProps.sb.userVoted && nextProps.sb.userChoice) {
      let voted = nextProps.sb.userVoted
      let votedChoiceId = nextProps.sb.userChoice
    }
    this.setState({voted: voted, votedChoiceId: votedChoiceId, expired: expired})
  }

  updateSbImages (props) {
    props.sb.choices.forEach(function (choice) {
      if (choice.photo) {
        let imageUrl = imagesRef.child(`${props.sb.privateAlias}/${choice.id}`)
        imageUrl.getDownloadURL().then(function (url) {
          const imageHolder = document.querySelector(`#image-holder-${choice.id}`)
          imageHolder.src = imageHolder === null ? 'http://placehold.it/200x200' : url
        }).catch(function (error) {
          switch (error.code) {
            case 'storage/object_not_found':
              break
            case 'storage/unauthorized':
              break
            case 'storage/canceled':
              break
            case 'storage/unknown':
              break
          }
        })
      }
    })
    if (props.sb.hasMainImage) {
      let imageUrl = imagesRef.child(`${props.sb.privateAlias}/main`)
      imageUrl.getDownloadURL().then(function (url) {
        const imageHolder = document.querySelector('#image-holder-main')
        imageHolder.src = imageHolder === null ? 'http://placehold.it/200x200' : url
      }).catch(function (error) {
        switch (error.code) {
          case 'storage/object_not_found':
            break
          case 'storage/unauthorized':
            break
          case 'storage/canceled':
            break
          case 'storage/unknown':
            break
        }
      })
    }
  }

  vote (e, choiceId) {
    let expired = false
    let oldDOMRefs = setDOMReferences(e)
    const {selected, votedBox, plusText, voteCount} = oldDOMRefs
    if (typeof this.props.sb.expires === 'string') expired = moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
    if (expired) {
      this.setState({expired: true})
      return
    }
    if (!selected) {
      e.currentTarget.querySelector('.selection-icon.selected').style.display = 'inline-block'
      e.currentTarget.querySelector('.selection-icon.unselected').style.display = 'none'
      if (votedBox) {
        votedBox.style.backgroundColor = 'white'
        votedBox.querySelector('.selection-icon.selected').style.display = 'none'
        votedBox.querySelector('.selection-icon.unselected').style.display = 'inline-block'
      }
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
    var updates = {
      userVoted: freshVote,
      userChoice: freshVote ? choiceId : null,
      choices: updatedChoices
    }
    var options = {
      choiceId,
      freshVote
    }
    this.handlers.updateSb(this.props.sb.id, updates, options)
    this.setState({voted: freshVote, votedChoiceId: freshVote ? choiceId : ''})
  }

  isTouched (choices) {
    let totalVotes = 0
    choices.forEach(function (choice) { totalVotes += choice.votes })
    return totalVotes > 0
  }

  sbClasses (choice) {
    const choices = this.props.sb.choices
    return classnames({
      'box-header': true,
      'clearfix': true,
      'selected': !this.state.expired && choice.id === this.props.sb.userChoice,
      'leader': this.state.expired && this.isTouched(choices) && choice.id === this.findLeader(choices).id
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
      currentContainer.style.backgroundColor = 'rgba(66, 103, 178, 0.1)'
    } else if (e.type === 'mouseleave') {
      currentVoteCount.style.marginRight = hide
      currentPlus.style.visibility = 'hidden'
      currentPlus.style.opacity = '0'
      currentContainer.style.backgroundColor = selected ? 'rgba(66, 103, 178, 0.2)' : 'white'
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

  addChoice () {
    if (this.state.expired) this.setState({error: 'Sorry, this snowballot has expired!'})
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

  handleAddChoiceChange (e) {
    const code = (e.keyCode ? e.keyCode : e.which)
    this.setState({error: ''})
    if (code === 13) {  // Enter keycode
      const choiceNames = this.props.sb.choices.map(choice => choice.title.toLowerCase())
      if (choiceNames.indexOf(this.state.newChoice.toLowerCase()) !== -1) this.setState({error: 'Sorry, that choice already exists!'})
      else this.addChoice()
    }
    this.setState({newChoice: e.target.value})
  }

  showAddChoice () {
    return (
      <span>
        <input
          id='detail-add-input'
          type='text' placeholder='Start typing a new choice here.'
          onChange={(e) => this.handleAddChoiceChange(e)}
          onKeyDown={(e) => this.handleAddChoiceChange(e)}
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

  shouldDisplayExtra (choice) {
    return choice.info || choice.photo || choice.hasGIF
  }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0) return null
    const taglist = this.props.sb.tags ? this.props.sb.tags.map((tag) => <span key={tag.text}>{tag.text}</span>) : null
    return (
      <div>
        {taglist && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        <h4 className='sb-title'>{this.props.sb.title}</h4>
        {this.props.sb.hasMainImage && <img id='image-holder-main' src='http://placehold.it/200/200' />}
        <div id='sb-description-text'>{this.props.sb.description || null}</div>
        <ul className='sb-choices'>
          {this.props.sb.choices.map((choice, idx) =>
            <span key={choice.id}>
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
              {this.shouldDisplayExtra(choice) &&
              <div className='more-sb-info'>
                {choice.info}
                {choice.photo && <img className='choice-image-holder' id={`image-holder-${choice.id}`} src={choice.photo} />}
                {choice.hasGIF && <img className='choice-gif-holder' id={`gif-holder-${choice.id}`} src={choice.GIF} />}
              </div>}
            </span>
          )}
        </ul>
        {this.props.sb.isExtensible && this.props.user.uid && !this.state.expired && this.showAddChoice()}
      </div>
    )
  }

  render () {
    return (
      <div>
        <SharePanel />
        <div className='above-sb-container'>
          <div className='other-sb-info'>
            {this.props.sb.expires && this.renderExpiresMessage()}
            {this.props.user.uid === this.props.sb.creator && this.renderCreatorMessage()}
            {this.renderAuthMessage()}
          </div>
        </div>
        <div className='detail-snowballot-container'>
          <div className='snowballots-section'>
            {this.renderSb()}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
