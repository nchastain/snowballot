import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import ReactModal from 'react-modal'
import DateTime from 'react-datetime'
import { ShareButtons } from 'react-share'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import moment from 'moment'
import * as actions from '.././actions'
import OptionPanel from './OptionPanel'
import FavoritePanel from './FavoritePanel'
import DeleteModal from './DeleteModal'
import SbChoices from './SbChoices'
import { createStateFromProps } from 'utilities/generalUtils'
import { didExpire, isCreator, updateImage, favoritedSb } from 'utilities/sbUtils'
import { creatorMessage, expiresMessage, authMessage, votesMessage, linkMessage, winnerMessage } from 'utilities/markupUtils'

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {tags: [], sortType: 'date'}
    this.addEventListening = this.addEventListening.bind(this)
  }

  componentWillMount () { this.props.dispatch(actions.findSb(this.props.match.params.alias)) }

  componentDidMount () {
    this.props.dispatch(actions.findSb(this.props.match.params.alias))
    window.addEventListener('click', this.addEventListening, false)
  }

  componentWillUnmount () {
    this.props.dispatch(actions.showSb({}))
    window.removeEventListener('click', this.addEventListening, false)
  }

  componentWillReceiveProps (nextProps) {
    let newState = createStateFromProps(this.props, nextProps)
    if (nextProps.sb && nextProps.sb.choices && nextProps.sb.choices.length > 1) this.setState(newState, () => this.updateSbImages(nextProps))
    this.setState({title: nextProps.sb.title, isExtensible: nextProps.sb.isExtensible, description: nextProps.sb.description, favorites: nextProps.sb.favorites, favorited: favoritedSb(nextProps.sb.id, nextProps.user.favorites)})
  }

  updateSbImages (props) {
    props.sb.choices.forEach(function (choice) { if (choice.photo) updateImage(props.sb.privateAlias, choice.id) })
  }

  addChoice () {
    if (didExpire(this.state.expires)) this.setState({error: 'Sorry, this snowballot has expired!'})
    const choiceNames = this.props.sb.choices.map(choice => choice.title.toLowerCase())
    if (choiceNames.indexOf(this.state.newChoice.toLowerCase()) !== -1) this.setState({error: 'Sorry, that choice already exists!'})
    else {
      const choice = {
        title: this.state.newChoice,
        votes: 0,
        id: this.props.sb.choices.length + 1,
        added: Date.now()
      }
      const options = {}
      this.setState({newChoice: '', showAddForm: false}, function() {
        this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {choices: [...this.props.sb.choices, choice]}, options))
      })
    }
  }

  handleAddChoiceChange (e) {
    const code = (e.keyCode ? e.keyCode : e.which)
    this.setState({error: ''})
    if (code === 13) {  // Enter
      const choiceNames = this.props.sb.choices.map(choice => choice.title.toLowerCase())
      if (choiceNames.indexOf(this.state.newChoice.toLowerCase()) !== -1) this.setState({error: 'Sorry, that choice already exists!'})
      else {
        this.addChoice()
        this.setState({newChoice: '', showAddForm: false})
      }
    } else this.setState({newChoice: e.target.value})
  }

  showAddChoice (expires) {
    const extensibleOrCreated = this.props.sb.isExtensible || isCreator(this.props.user.uid, this.props.sb.creator)
    if (extensibleOrCreated && this.props.user.uid && didExpire(expires)) return
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
          <FA name='plus' className='fa fa-fw' />add choice
        </div>
        {this.state.error ? <div className='error-message'>{this.state.error}</div> : null}
      </span>
    )
  }

  hasExtra ({info, photo, GIF, youtube, link}) { return info || photo || GIF || youtube || link }

  favoriteSnowballot (id, favorites) {
    this.setState({'favorited': !this.state.favorited}, function () {
      const addition = this.state.favorited ? 1 : -1
      if (!favorites) favorites = 0
      this.props.dispatch(actions.startUpdateSb(id, {favorites: favorites + addition}))
      this.props.dispatch(actions.startUpdateUserAll('favorites', {...favorites, [id]: this.state.favorited}))
    })
  }

  toggleModal (type) { this.setState({[type]: !this.state[type]}) }

  reallyDelete () {
    this.setState({showModal: false})
    this.props.dispatch(actions.startDeleteSb(this.props.sb.id))
    document.getElementById('link-following-deletion').click()
  }

  editMessage () {
    if (!isCreator(this.props.user.uid, this.props.sb.creator)) return
    return (
      <span>
        <DeleteModal toggle={() => this.toggleModal('showModal')} showModal={this.state.showModal} deleteConfirm={() => this.reallyDelete()} />
        <ReactTooltip id='delete-tooltip' effect='solid'><span>Delete snowballot</span></ReactTooltip>
        <div className='edit-button button action-button' onClick={() => this.toggleModal('showOptionsModal')} data-tip data-for='settings-tooltip'>
          <FA name='gear' className='fa fa-fw' />
          <ReactModal id='edit-options-modal' contentLabel='delete-sb' isOpen={this.state.showOptionsModal} className='Modal' overlayClassName='Overlay'>
            <div id='close-modal' onClick={() => this.toggleModal('showOptionsModal')}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top'>Edit Snowballot Options</div>
            <OptionPanel
              handleOptionToggle={(e) => this.setState({[e.target.id]: !this.state[e.target.id]})}
              setDate={data => this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')})}
              toggleAlias={(e) => this.setState({alias: e.target.value})}
              deletion={() => this.setUpEventHandling(this.state.choices)}
              toggleDescription={(e) => this.setState({description: e.target.value})}
              handleAdd={(tag) => this.handleAdd(tag, () => { this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {tags: this.state.tags})) })}
              handleDelete={(i) => this.handleDelete(i, () => { this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {tags: this.state.tags})) })}
              toggleMenu={() => this.setState({optionsExpanded: !this.state.optionsExpanded})}
              optionsExpanded
              showButton={false}
              {...this.state}
            />
          </ReactModal>
        </div>
        <ReactTooltip id='settings-tooltip' effect='solid'><span>Edit snowballot settings</span></ReactTooltip>
      </span>
    )
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

  buildInfoPanel (expires, userID, creator, createdAt, alias, choices, id, user) {
    const pageUrl = `http://www.snowballot.com/sbs/${alias}`
    const pageTitle = this.props.sb.title
    const description = 'Please click the link to vote on this.'
    const { FacebookShareButton, TwitterShareButton } = ShareButtons
    return (
      <div className='above-sb-container'>
        <div id='sb-info'>
          <ul>
            {creatorMessage(userID, creator, createdAt, alias)}
            {expiresMessage(expires)}
            {votesMessage(choices, id, user, expires)}
            {winnerMessage(expires, choices)}
            {linkMessage(alias)}
            {authMessage(userID)}
          </ul>
        </div>
        <div id='sb-actions'>
          {this.editMessage()}
          <span className='button action-button' data-tip data-for='twitter-share-tooltip'>
            <TwitterShareButton
              children={<FA name='twitter' className='fa fa-fw' />}
              url={pageUrl}
              title={pageTitle}
              description={description}
            />
          </span>
          <ReactTooltip id='twitter-share-tooltip' effect='solid'><span>Share on Twitter</span></ReactTooltip>
          <span className='button action-button' data-tip data-for='facebook-share-tooltip'>
            <FacebookShareButton
              children={<FA name='facebook' className='fa fa-fw' />}
              url={pageUrl}
              title={pageTitle}
              description={description}
            />
          </span>
          <ReactTooltip id='facebook-share-tooltip' effect='solid'><span>Share on Facebook</span></ReactTooltip>
        </div>
      </div>
    )
  }

  sortChoices (a, b) {
    if (this.state.sortType === 'date') return moment.unix(a.added).isBefore(moment.unix(b.added)) ? -1 : 1
    if (this.state.sortType === 'AZ') return b.title > a.title ? -1 : 1
    if (this.state.sortType === 'votes') return b.votes - a.votes
  }

  addEventListening () {
    const editElems = ['edit-description', 'edit-title', 'edit-save-button', 'sb-title', 'sb-description-text', 'detail-add-choice', 'detail-add-input', 'add-tile']
    if (editElems.indexOf(event.target.id) === -1 && document.getElementById('add-tile')) this.setState({editing: false})
  }

  checkEnter (e, editField) {
    if (e.keyCode === 13) this.handleSbChange(editField)
  }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0 || typeof this.props.sb.choices === 'undefined') return null
    const taglist = this.props.sb.tags && this.props.sb.tags.length > 0 ? this.props.sb.tags.map((tag) => <span key={tag.text}>{tag.text}</span>) : null
    const editForm = (editField) => {
      return (
        <span className='edit-form' >
          {this.state.editing === 'description' && <textarea rows={5} id='edit-description' value={this.state.description} onChange={(e) => this.setState({description: e.currentTarget.value})} onKeyDown={(e) => this.checkEnter(e, 'description')} />}
          {this.state.editing !== 'description' && <input type='text' id={`edit-${editField}`} value={this.state[editField]} onChange={(e) => this.setState({[editField]: e.currentTarget.value})} onKeyDown={(e) => this.checkEnter(e, 'title')} />}
          <div id='edit-save-button' className='button' onClick={() => this.handleSbChange(editField)}>Save</div>
        </span>
      )
    }
    const sortOptions = () => {
      const sortClasses = (sortType) => {
        return {
          'sort-option': true,
          'active': sortActive(sortType)
        }
      }
      const sortActive = (sortType) => sortType === this.state.sortType
      return (
        <div id='top-info'>
          <div id='main-info'>
            {this.state.editing !== 'title' && <h4 id='sb-title' className='sb-title' onClick={() => this.setState({editing: 'title'})}>{this.props.sb.title}</h4>}
            {this.state.editing === 'title' && isCreator(this.props.user.uid, this.props.sb.creator) && editForm('title')}
            {this.state.description && this.state.editing !== 'description' && <div id='sb-description-text' onClick={() => this.setState({editing: 'description'})}>{this.props.sb.description || null}</div>}
            {this.state.editing === 'description' && isCreator(this.props.user.uid, this.props.sb.creator) && editForm('description')}
          </div>
          <div id='sort-option-content'>
            <div id='sort-option-key'>
              sort choices by:&nbsp;&nbsp;
              <div className={classnames(sortClasses('votes'))} onClick={() => this.setState({sortType: 'votes'})}>votes</div>
              <div className={classnames(sortClasses('AZ'))} onClick={() => this.setState({sortType: 'AZ'})}>A→Z</div>
              <div className={classnames(sortClasses('date'))} onClick={() => this.setState({sortType: 'date'})}>date added</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='snowballots-section'>
        <FavoritePanel favorites={this.state.favorites} favorited={this.state.favorited} />
        {this.state.tags && this.state.tags.length > 0 && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        {sortOptions()}
        <div id='separator' />
        <SbChoices choices={this.props.sb.choices.sort((a, b) => this.sortChoices(a, b))} isExtensible={this.state.isExtensible} userID={this.props.user.uid} expires={this.state.expires} userChoice={this.props.sb.userChoice} onAdd={() => this.setState({showAddForm: true})} />
        {this.state.showAddForm && this.showAddChoice(this.state.expires)}
      </div>
    )
  }

  render () {
    const { creator, createdAt, alias, choices, id } = this.props.sb
    const userID = this.props.user.uid
    return (
      <div id='accent-container' className='sb-detail-accent'>
        <div id='sb-detail'>
          {this.buildInfoPanel(this.state.expires, userID, creator, createdAt, alias, choices, id, this.props.user)}
          <div className='detail-snowballot-container'>{this.renderSb()}</div>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
