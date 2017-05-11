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
import ReactPlayer from 'react-player'
import IncludedMedia from './IncludedMedia'
import omit from 'object.omit'
import ReactModal from 'react-modal'
import DateTime from 'react-datetime'

ReactModal.defaultStyles.content.top = '25%'
ReactModal.defaultStyles.content.bottom = 'calc(75% - 125px)'
ReactModal.defaultStyles.content.left = '300px'
ReactModal.defaultStyles.content.right = '300px'

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
    let voted = props.sb.userChoice
    let votedChoiceId = props.sb.userVoted
    let expired = false
    if (typeof props.sb.expires === 'string') expired = moment(new Date(props.sb.expires)).isBefore(moment(Date.now()))
    this.state = {
      newChoice: '',
      voted: voted,
      votedChoiceId: votedChoiceId,
      expired: expired,
      expires: props.sb.expires
    }
    this.handlers = createHandlers(props.dispatch)
    this.sbClasses = this.sbClasses.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(actions.findSb(this.props.match.params.alias))
  }

  componentWillReceiveProps (nextProps) {
    let expired = false
    let voted = false
    let votedChoiceId = ''
    if (nextProps.sb) {
      if (typeof nextProps.sb.expires === 'string') expired = moment(new Date(this.props.sb.expires)).isBefore(moment(Date.now()))
      if (nextProps.sb.choices && nextProps.sb.choices.length !== 0 && nextProps.sb.privateAlias && nextProps.sb.privateAlias !== '') this.updateSbImages(nextProps)
    }
    if (nextProps.user.favorites) {
      this.setState({favorited: nextProps.user.favorites[nextProps.sb.id]})
    }
    if (nextProps.sb && nextProps.sb.userVoted && nextProps.sb.userChoice) {
      voted = nextProps.sb.userVoted
      votedChoiceId = nextProps.sb.userChoice
    }
    if (nextProps.sb && nextProps.user && nextProps.user.favorited) {
      this.setState({'favorited': nextProps.user.favorited[nextProps.sb.id]})
    }
    this.setState({voted, votedChoiceId, expired})
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
    return choice.info || choice.photo || choice.GIF || choice.youtube || choice.link
  }

  favoriteSnowballot (id) {
    this.setState({favorited: !this.state.favorited}, function () {
      this.props.dispatch(actions.startUpdateUserAll('favorites', {[id]: this.state.favorited}))
    })
  }

  openModal (type) {
    if (type === 'delete') this.setState({showModal: true})
    else if (type === 'options') this.setState({showOptionsModal: true})
  }

  closeModal (type) {
    if (type === 'delete') this.setState({showModal: false})
    else if (type === 'options') this.setState({showOptionsModal: false})
  }

  reallyDelete () {
    this.setState({showModal: false})
    this.props.dispatch(actions.startDeleteSb(this.props.sb.id))
    document.getElementById('link-following-deletion').click()
  }

  handleOptionToggle (e) {
    switch (e.currentTarget.id) {
      case 'option-expire':
        this.setState({expires: !this.state.expires})
        break
      default:
        break
    }
  }

  renderEditMessage () {
    const datePicker = (
      <div>
        <DateTime
          id='date-time'
          inputProps={{placeholder: 'Enter an expiration date'}}
          value={this.state.expires || ''}
          onChange={(data) => {
            this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')})
            this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {expires: this.state.expires}))
          }}
          closeOnSelect
        />
      </div>
    )
    return (
      <span>
        <div className='delete-button button' onClick={() => this.openModal('delete')}>
          <FA name='trash' className='fa fa-fw' />Delete snowballot
          <ReactModal contentLabel='delete-sb' isOpen={this.state.showModal}>
            <div id='modal-content'>
              <div id='modal-top'>
                <div id='close-modal' onClick={() => this.closeModal('delete')}><FA className='fa-2x fa-fw' name='times-circle' /></div>
                Delete this snowballot?
              </div>
              <div id='delete-choices'>
                <div id='delete-confirm' className='button' onClick={() => this.reallyDelete()}>Delete</div>
                <div id='delete-cancel' className='button' onClick={() => this.closeModal('delete')}>Cancel</div>
                <Link to='/' id='link-following-deletion' style={{display: 'none'}} />
              </div>
            </div>
          </ReactModal>
        </div>
        <div className='edit-button button' onClick={() => this.openModal('options')}>
          <FA name='pencil' className='fa fa-fw' />Edit snowballot options
          <ReactModal id='edit-options-modal' contentLabel='delete-sb' isOpen={this.state.showOptionsModal} className='Modal' overlayClassName='Overlay'>
            <div id='close-modal' onClick={() => this.closeModal('options')}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top'>
              Edit Snowballot Options
            </div>
            <div id='options-panel'>
              <div className='options-unit'>
                <div className='options-icon'>
                  <FA name='calendar-times-o' className='fa-2x fa-fw' />
                </div>
                <div className='options-unit-text'>
                  Lock voting on snowballot after certain time?
                </div>
                <div className='options-selector'>
                  <FA
                    id='option-expire'
                    name={this.state.expires ? 'check-circle' : 'circle'}
                    className='fa fa-fw custom-check'
                    onClick={(e) => this.handleOptionToggle(e)}
                  />
                </div>
                <div className='options-rest'>
                  {this.state.expires && datePicker}
                </div>
              </div>
            </div>
          </ReactModal>
        </div>
      </span>
    )
  }

  isCreator () {
    return this.props.user.uid === this.props.sb.creator
  }

  updateField (field) {
    !this.state.editing ? this.setState({editing: field}) : this.setState({editing: false})
  }

  handleSbChange (field) {
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, { [field]: this.state[field] }))
    this.setState({editing: false})
  }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0) return null
    const taglist = this.props.sb.tags ? this.props.sb.tags.map((tag) => <span key={tag.text}>{tag.text}</span>) : null
    const starClasses = {
      'fa-2x': true,
      'fa-fw': true,
      'favorited': this.state.favorited
    }
    const editor = (field) => <div className='editor' onClick={() => this.updateField(field)}><FA name='pencil' className='fa fa-fw' /></div>
    const extensibleOrCreated = this.props.sb.isExtensible || this.isCreator()
    const editForm = (editField) => {
      return (
        <span className='edit-form' >
          <input type='text' id={`edit-${editField}`} placeholder={`Enter new ${editField} here`} value={this.state[editField]} onChange={(e) => this.setState({[editField]: e.currentTarget.value})} />
          <div className='button' onClick={() => this.handleSbChange(editField)}>Save</div>
        </span>
      )
    }
    return (
      <div>
        <div id='favorite-panel'>
          <FA
            id='favorite-star'
            name={this.state.favorited ? 'star' : 'star-o'}
            className={classnames(starClasses)}
            onClick={() => this.favoriteSnowballot(this.props.sb.id)}
          />
        </div>
          {taglist && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        <h4 className='sb-title'>{this.props.sb.title}</h4>{this.isCreator() && editor('title')}
        {this.state.editing && editForm('title')}
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
                <IncludedMedia included={omit(choice, ['votes', 'title', 'id'], (val) => val !== '')} />
              </div>}
            </span>
          )}
        </ul>
        {extensibleOrCreated && this.props.user.uid && !this.state.expired && this.showAddChoice()}
      </div>
    )
  }

  render () {
    return (
      <div id='sb-detail'>
        <SharePanel />
        <div className='above-sb-container'>
          <div className='other-sb-info'>
            {this.props.sb.expires && this.renderExpiresMessage()}
            {this.isCreator() && this.renderCreatorMessage()}
            {this.isCreator() && this.renderEditMessage()}
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
