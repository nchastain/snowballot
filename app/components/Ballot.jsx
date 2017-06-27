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
import BallotChoiceGrid from './BallotChoiceGrid'
import BallotInfoPanel from './BallotInfoPanel'
import ChoiceMediaPane from './ChoiceMediaPane'
import LoadingSpinner from './LoadingSpinner'
import { didExpire, isCreator, favoritedSb } from 'utilities/ballotUtils'
import {
  creatorMessage,
  expiresMessage,
  authMessage,
  votesMessage,
  linkMessage,
  winnerMessage
} from 'utilities/markupUtils'

export class Ballot extends Component {
  constructor (props) {
    super(props)
    this.state = {sortType: 'votes', addChoiceOptions: false, tags: props.tags || []}
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    this.props.dispatch(actions.findSb(this.props.match.params.alias))
  }

  componentDidMount () {
    this.props.dispatch(actions.findSb(this.props.match.params.alias))
  }

  componentWillUnmount () {
    this.props.dispatch(actions.showSb({}))
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      expires: nextProps.sb.expires,
      title: nextProps.sb.title,
      isPrivate: nextProps.sb.isPrivate,
      isExtensible: nextProps.sb.isExtensible,
      tags: nextProps.sb.tags || [],
      alias: nextProps.sb.alias,
      description: nextProps.sb.description,
      favorites: nextProps.sb.favorites,
      favorited: favoritedSb(nextProps.sb.id, nextProps.user.favorites)
    })
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
        added: Date.now(),
        info: this.state.info || '',
        photo: this.state.photo || '',
        youtube: this.state.youtube || '',
        link: this.state.link || ''
      }
      const options = {}
      this.setState({
        newChoice: '',
        showAddForm: false,
        info: '',
        photo: '',
        youtube: '',
        link: ''
      }, function () {
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

  renderOptionsPanel () {
    return <div style={{'background-color': 'white', 'padding': '10px'}}>Hi</div>
  }

  toggleChoiceOptions (e) {
    this.setState({addChoiceOptions: !this.state.addChoiceOptions})
  }

  showAddChoice (expires) {
    const extensibleOrCreated = this.props.sb.isExtensible || isCreator(this.props.user.uid, this.props.sb.creator)
    if (extensibleOrCreated && this.props.user.uid && didExpire(expires)) return
    return (
      <ReactModal contentLabel='delete-sb' isOpen={this.state.showAddForm} className='Modal' overlayClassName='Overlay add-modal'>
        <div id='close-modal' onClick={() => this.setState({showAddForm: null})}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top-container' style={{display: 'inline-block', 'width': '100%', 'height': '55px'}}>
              <div id='modal-top'>
              </div>
            </div>
        <input
          style={{top: '50px'}}
          id='detail-add-input'
          type='text' placeholder='Start typing a new choice here.'
          onChange={(e) => this.handleAddChoiceChange(e)}
          onKeyDown={(e) => this.handleAddChoiceChange(e)}
          value={this.state.newChoice}
        />
        <ChoiceMediaPane id={this.props.sb.choices.length + 1} choices={this.props.sb.choices} isNewChoice updateSection={(section, content) => this.setState({[section]: content})} />
        <div
          id='detail-add-choice'
          className='button secondary'
          onClick={() => this.addChoice()}
        >
          <FA name='plus' className='fa fa-fw' />add choice
        </div>
        {this.state.error ? <div className='error-message'>{this.state.error}</div> : null}
      </ReactModal>
    )
  }

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

  handleOptionToggle (e, specifier) {
    if (specifier === 'expires') {
      this.setState({[e.currentTarget.id]: !this.state[e.currentTarget.id], expires: DateTime.moment(moment().add(1, 'week')).format('MM/DD/YYYY h:mm a')})
    }
    if (!specifier) this.setState({[e.target.id]: !this.state[e.target.id]})
    else this.setState({[e.currentTarget.id]: !this.state[e.currentTarget.id]})
  }

  editMessage () {
    if (!isCreator(this.props.user.uid, this.props.sb.creator)) return
    return (
      <span>
        <DeleteModal toggle={() => this.toggleModal('showModal')} showModal={this.state.showModal} deleteConfirm={() => this.reallyDelete()} />
        <ReactTooltip id='delete-tooltip' effect='solid'><span>Delete snowballot</span></ReactTooltip>
        <div className='edit-button button action-button' onClick={() => this.toggleModal('showOptionsModal')} data-tip data-for='settings-tooltip'>
          <FA name='gear' className='fa fa-fw' />
          <ReactModal contentLabel='delete-sb' isOpen={this.state.showOptionsModal} className='Modal' overlayClassName='Overlay edit-options-modal'>
            <div id='close-modal' onClick={() => this.toggleModal('showOptionsModal')}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top'>Edit Snowballot Options</div>
            <OptionPanel
              handleOptionToggle={(e) => this.handleOptionToggle(e)}
              setDate={data => {
                const that = this
                this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY')}, function () {
                  that.props.dispatch(actions.startUpdateSb(that.props.sb.id, {expires: that.state.expires}))
                })
              }}
              toggleAlias={(e) => this.setState({alias: e.target.value})}
              deletion={() => this.setUpEventHandling(this.state.choices)}
              toggleDescription={(e) => this.setState({description: e.target.value})}
              handleAdd={(tag) => this.handleAdd(tag)}
              handleDelete={(i) => this.handleDelete(i)}
              toggleMenu={() => this.setState({optionsExpanded: !this.state.optionsExpanded})}
              optionsExpanded
              didExpire={Boolean(this.state.expires)}
              showButton={false}
              save={(e) => {
                this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {[e.target.id]: this.state[e.target.id]}))
              }}
              tags={this.props.sb.tags}
              {...this.state}
              showSave
            />
          </ReactModal>
        </div>
        <ReactTooltip id='settings-tooltip' effect='solid'><span>Edit snowballot settings</span></ReactTooltip>
      </span>
    )
  }

  handleDelete (i) {
    const that = this
    const newTags = [...this.state.tags.slice(0, i), ...this.state.tags.slice(i + 1)]
    this.setState({tags: newTags}, function () {
      that.props.dispatch(actions.startUpdateSb(that.props.sb.id, {tags: that.state.tags}))
    })
  }

  handleAdd (tag) {
    if (this.state.tags && this.state.tags.length >= 7) return
    const that = this
    const newTags = [...this.state.tags, {id: this.state.tags.length + 1, text: tag}]
    this.setState({tags: newTags}, function () {
      that.props.dispatch(actions.startUpdateSb(that.props.sb.id, {tags: this.state.tags}))
    })
  }

  updateField (field) {
    !this.state.editing ? this.setState({editing: field}) : this.setState({editing: false})
  }

  handleSbChange (field) {
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, { [field]: this.state[field] }))
    this.setState({editing: false})
  }

  sortChoices (a, b) {
    if (this.state.sortType === 'date') return moment.unix(a.added).isBefore(moment.unix(b.added)) ? -1 : 1
    if (this.state.sortType === 'AZ') return b.title > a.title ? -1 : 1
    if (this.state.sortType === 'votes') return b.votes - a.votes
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

    const fullGrid = (
      <span>
        <BallotChoiceGrid
          choices={this.props.sb.choices.sort((a, b) => this.sortChoices(a, b))}
          isExtensible={this.state.isExtensible}
          userID={this.props.user.uid}
          expires={this.state.expires}
          userChoice={this.props.sb.userChoice}
          onAdd={() => this.setState({showAddForm: true})}
        />
        {this.state.showAddForm && this.showAddChoice(this.state.expires)}
      </span>
    )

    return (
      <div className='snowballots-section'>
        <FavoritePanel favorites={this.state.favorites} favorited={this.state.favorited} />
        {this.props.sb.tags && this.props.sb.tags.length > 0 && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        {sortOptions()}
        <div id='separator' />
        {!this.props.sb.choices ? <LoadingSpinner /> : fullGrid}
      </div>
    )
  }

  render () {
    let that = this
    return (
      <div id='accent-container' className='sb-detail-accent'>
        <div id='ballot'>
          <BallotInfoPanel sb={that.props.sb} user={that.props.user} editMessage={() => this.editMessage()} />
          <div className='detail-snowballot-container'>{this.renderSb()}</div>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Ballot)
