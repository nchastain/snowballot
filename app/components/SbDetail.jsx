import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import moment from 'moment'
import classnames from 'classnames'
import SharePanel from './SharePanel'
import { imagesRef } from '../firebase/constants'
import IncludedMedia from './IncludedMedia'
import omit from 'object.omit'
import ReactModal from 'react-modal'
import DateTime from 'react-datetime'
import Tagger from './Tagger'
import { doesExpire, isCreator, previewImage, findLeader } from '.././utilities/sbUtils'

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
    this.state = {
      tags: props.sb.tags || [],
      newChoice: '',
      isExtensible: props.sb.isExtensible,
      voted: props.sb.userChoice,
      votedChoiceId: props.sb.userVoted,
      suggestions: [],
      expires: props.sb.expires,
      isPrivate: props.sb.isPrivate,
      doExpire: Boolean(props.sb.expires),
      description: props.sb.description,
      mainImage: props.sb.mainImage
    }
    this.handlers = createHandlers(props.dispatch)
    this.sbClasses = this.sbClasses.bind(this)
  }

  componentWillMount () {
    this.props.dispatch(actions.findSb(this.props.match.params.alias))
  }

  componentDidMount () {
    this.props.dispatch(actions.findSb(this.props.match.params.alias))
  }

  componentWillUnmount () {
    this.props.dispatch(actions.showSb({}))
  }

  componentWillReceiveProps (nextProps) {
    let newState = {}
    for (const prop in nextProps) {
      if (nextProps[prop] !== this.props[prop]) newState[prop] = nextProps[prop]
    }
    if (nextProps.sb.choices > 1) {
      this.setState(newState)
      this.updateSbImages(nextProps)
    }
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
    let oldDOMRefs = setDOMReferences(e)
    const {selected, votedBox, plusText, voteCount} = oldDOMRefs
    if (doesExpire(this.state.expires)) return
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
      'selected': !doesExpire(this.state.expires) && choice.id === this.props.sb.userChoice,
      'leader': doesExpire(this.state.expires) && this.isTouched(choices) && choice.id === findLeader(choices).id
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
    if (!this.props.user.uid || doesExpire(this.state.expires)) return
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
        <FA name='clock-o' className='fa fa-fw' />This snowballot {doesExpire(this.state.expires) ? 'has expired.' : `expires after ${this.props.sb.expires}` }
      </span>
    )
  }

  addChoice () {
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
    const that = this
    switch (e.currentTarget.id) {
      case 'option-expire':
        this.setState({doExpire: !this.state.doExpire})
        break
      case 'option-extensible':
        this.setState({isExtensible: !this.state.isExtensible})
        break
      case 'option-private':
        this.setState({isPrivate: !this.state.isPrivate}, function () {
          this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {isPrivate: that.state.isPrivate}))
        })
        break
      default:
        break
    }
  }

  renderEditMessage () {
    const that = this
    const publicAlias = <span>Add a custom URL?&#58; snowballot.com&#47;sbs&#47;</span>
    const privateAlias = <span className='disabled-option'>(Sorry, custom URLs are only available for public snowballots.)</span>
    const datePicker = (
      <div>
        <DateTime
          id='date-time'
          inputProps={{placeholder: 'Enter an expiration date'}}
          value={this.state.expires || ''}
          onChange={(data) => {
            this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')}, function () {
              that.props.dispatch(actions.startUpdateSb(this.props.sb.id, {expires: that.state.expires}))
            })
          }}
          closeOnSelect
        />
      </div>
    )
    const deleteButton = (
      <span className='fa-stack fa-md delete-button' onClick={() => {
        this.setState({hasMainImage: false, mainImage: undefined}, () => {
          this.handleSbChange('mainImage')
          this.handleSbChange('hasMainImage')
          this.addImage(this.props.sb.privateAlias, 'deleted')
        })
      }}>
        <FA name='circle' className='fa fa-stack-2x' />
        <FA name='times-circle' className='fa-stack-2x fa-fw delete-x' />
      </span>
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
              {/* Lock voting */}
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
                    name={this.state.doExpire ? 'check-circle' : 'circle'}
                    className='fa fa-fw custom-check edit-fa'
                    onClick={(e) => this.handleOptionToggle(e)}
                  />
                </div>
                <div className='options-rest'>
                  {this.state.doExpire && datePicker}
                </div>
              </div>

              {/* Private/public */}
              <div className='options-unit'>
                <div className='options-icon'>
                  <FA name='eye-slash' className='fa-2x fa-fw' />
                </div>
                <div className='options-unit-text'>
                  Make snowballot private?
                </div>
                <div className='options-selector'>
                  <FA
                    id='option-private'
                    name={this.state.isPrivate ? 'check-circle' : 'circle'}
                    className='fa fa-fw custom-check edit-fa'
                    onClick={(e) => this.handleOptionToggle(e)}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className='options-unit'>
                <div className='options-icon'>
                  <FA name='tags' className='fa-2x fa-fw' />
                </div>
                <div className='options-unit-text'>
                  Add tags to this snowballot?
                </div>
                <div className='options-rest'>
                  <Tagger
                    className='tag-holder'
                    handleAdd={(tag) => this.handleAdd(tag)}
                    handleDelete={(i) => this.handleDelete(i)}
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                  />
                </div>
              </div>

              {/* Description */}
              <div className='options-unit'>
                <div className='options-icon'>
                  <FA name='pencil' className='fa-2x fa-fw' />
                </div>
                <div className='options-unit-text'>
                  Edit description for this snowballot?
                </div>
                <div className='options-rest'>
                  <textarea
                    rows={3}
                    value={this.state.description}
                    onChange={(e) => this.setState({description: e.target.value})}
                  />
                </div>
                <div id='description-submit' className='button' onClick={() => {
                  this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {description: this.state.description}))
                  this.closeModal('options')
                }}>
                  Save
                </div>
              </div>

              {/* Photo */}
              <div className='options-unit'>
                <div className='options-icon'>
                  <FA name='photo' className='fa-2x fa-fw' />
                </div>
                <div className='options-unit-text'>
                  Add a new photo for this snowballot?
                </div>
                <div className='options-rest'>
                  {!this.state.mainImage && <div className='photo-uploader' id='photo-upload-main'>
                    <input type='file' className='file-input' id='file-input-main' style={{display: 'none'}} onChange={(e) => this.handleUpload(e)} />
                    <div id='upload-button' onClick={() => document.getElementById('file-input-main').click()}><FA name='upload' className='fa fa-fw' />Upload a file</div>
                  </div>}
                  <div id='gallery-main' className={!this.state.hasMainImage ? 'hidden' : ''}>
                    <img className='gallery-image' id='gallery-img-main' src={this.state.mainImage} />
                    <div id='main-image-delete-button' className='main-image-delete'>{deleteButton}</div>
                  </div>
                </div>
                {this.state.mainImage && <div id='photo-submit' className='button' onClick={() => {
                  this.props.dispatch(actions.startUpdateSb(this.props.sb.privateAlias, {mainImage: this.state.mainImage}))
                  this.closeModal('options')
                }}>
                  Save
                </div>}
              </div>

              {/* URL Alias */}
              <div className='options-unit'>
                <div className='options-icon'>
                  <FA
                    name='snowflake-o'
                    className={classnames({'fa-2x': true, 'fa-fw': true, 'disabled-option': this.state.isPrivate})}
                  />
                </div>
                <div className='options-unit-text'>
                  {this.state.isPrivate ? privateAlias : publicAlias}
                </div>
                {!this.state.isPrivate &&
                <span>
                  <div className='options-selector'>
                    <input
                      type='text'
                      value={this.state.alias}
                      onChange={(e) => this.setState({alias: e.target.value})}
                    />
                  </div>
                  <div id='url-submit' className='button' onClick={() => {
                    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {alias: this.state.alias}))
                    this.closeModal('options')
                  }}>
                    Save
                  </div>
                </span>}
              </div>

            {/* Extensibility */}
            <div className='options-unit'>
              <div className='options-icon'>
                <FA name='users' className='fa-2x fa-fw' />
              </div>
              <div className='options-unit-text'>
                Allow others to add new choices?
              </div>
              <div className='options-selector'>
                <FA
                  id='option-extensible'
                  name={this.state.isExtensible ? 'check-circle' : 'circle'}
                  className='fa fa-fw custom-check edit-fa'
                  onClick={(e) => this.handleOptionToggle(e)}
                />
              </div>
            </div>

            </div>
          </ReactModal>
        </div>
      </span>    
    )
  }

  handleUpload (e) {
    let files = e.target.files
    let that = this
    previewImage(files[0], `#gallery-img-main`)
    this.setState({hasMainImage: true, mainImage: files[0]}, function () {
      that.handleSbChange('mainImage')
      that.handleSbChange('hasMainImage')
      that.addImage(that.props.sb.privateAlias, files[0])
    })
  }

  addImage (alias, file) {
    let newImageRef = imagesRef.child(`${alias}/main`)
    this.startUpdateSb(this.props.sb.privateAlias, {mainImage: file})
    if (file === 'deleted') newImageRef.delete().then(() => console.log('Removed a file!'))
    else newImageRef.put(file).then(() => console.log('Uploaded a file!'))
  }

  handleDelete (i) {
    let tags = this.state.tags
    let that = this
    tags.splice(i, 1)
    this.setState({tags: tags}, function () {
      that.props.dispatch(actions.startUpdateSb(that.props.sb.id, {tags: that.state.tags}))
    })
  }

  handleAdd (tag) {
    let tags = this.state.tags
    let that = this
    tags.push({
      id: tags.length + 1,
      text: tag
    })
    this.setState({tags: tags}, function () {
      that.props.dispatch(actions.startUpdateSb(that.props.sb.id, {tags: that.state.tags}))
    })
  }

  updateField (field) {
    !this.state.editing ? this.setState({editing: field}) : this.setState({editing: false})
  }

  handleSbChange (field) {
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, { [field]: this.state[field] }))
    this.setState({editing: false})
  }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0 || typeof this.props.sb.choices === 'undefined') return null
    const taglist = this.props.sb.tags ? this.props.sb.tags.map((tag) => <span key={tag.text}>{tag.text}</span>) : null
    const starClasses = {
      'fa-2x': true,
      'fa-fw': true,
      'favorited': this.state.favorited
    }
    const editor = (field) => <div className='editor' onClick={() => this.updateField(field)}><FA name='pencil' className='fa fa-fw' /></div>
    const extensibleOrCreated = this.props.sb.isExtensible || isCreator(this.props.user.uid, this.props.sb.creator)
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
          {this.state.tags.length > 0 && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        <h4 className='sb-title'>{this.props.sb.title}</h4>{isCreator(this.props.user.uid, this.props.sb.creator) && editor('title')}
        {this.state.editing && editForm('title')}
        {this.state.mainImage && <img id='image-holder-main' src={this.state.mainImage} />}
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
        {extensibleOrCreated && this.props.user.uid && !doesExpire(this.state.expires) && this.showAddChoice()}
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
            {isCreator(this.props.user.uid, this.props.sb.creator) && this.renderCreatorMessage()}
            {isCreator(this.props.user.uid, this.props.sb.creator) && this.renderEditMessage()}
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
