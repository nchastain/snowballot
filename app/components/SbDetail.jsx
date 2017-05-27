import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import ReactModal from 'react-modal'
import DateTime from 'react-datetime'
import classnames from 'classnames'
import * as actions from '.././actions'
import { imagesRef } from '../firebase/constants'
import OptionPanel from './OptionPanel'
import FavoritePanel from './FavoritePanel'
import DeleteModal from './DeleteModal'
import SharePanel from './SharePanel'
import SbChoices from './SbChoices'
import { createStateFromProps } from 'utilities/generalUtils'
import { doesExpire, isCreator, previewImage, updateImage } from 'utilities/sbUtils'
import { creatorMessage, expiresMessage, authMessage } from 'utilities/markupUtils'

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {tags: [], sortType: 'date'}
  }

  componentWillMount () { this.props.dispatch(actions.findSb(this.props.match.params.alias)) }

  componentDidMount () { this.props.dispatch(actions.findSb(this.props.match.params.alias)) }

  componentWillUnmount () { this.props.dispatch(actions.showSb({})) }

  componentWillReceiveProps (nextProps) {
    let newState = createStateFromProps(this.props, nextProps)
    if (nextProps.sb.choices > 1) this.setState(newState, () => this.updateSbImages(nextProps))
  }

  updateSbImages (props) {
    props.sb.choices.forEach(function (choice) { if (choice.photo) updateImage(props.sb.privateAlias, choice.id) })
    if (props.sb.hasMainImage) updateImage(props.sb.privateAlias, 'main')
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
    if (extensibleOrCreated && this.props.user.uid && doesExpire(expires)) return
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

  favoriteSnowballot (id) {
    this.setState({favorited: !this.state.favorited}, function () {
      this.props.dispatch(actions.startUpdateUserAll('favorites', {[id]: this.state.favorited}))
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
        <div className='edit-button button' onClick={() => this.toggleModal('showOptionsModal')}>
          <FA name='pencil' className='fa fa-fw' />Edit snowballot options
          <ReactModal id='edit-options-modal' contentLabel='delete-sb' isOpen={this.state.showOptionsModal} className='Modal' overlayClassName='Overlay'>
            <div id='close-modal' onClick={() => this.toggleModal('showOptionsModal')}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top'>Edit Snowballot Options</div>
            <OptionPanel
              handleOptionToggle={(e) => this.setState({[e.target.id]: !this.state[e.target.id]})}
              setDate={data => this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')})}
              toggleAlias={(e) => this.setState({alias: e.target.value})}
              deletion={() => { this.setState({hasMainImage: false, mainImage: undefined}, () => this.setUpEventHandling(this.state.choices)) }}
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
    this.props.dispatch(actions.startUpdateSb(this.props.sb.privateAlias, {mainImage: file}))
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

  updateField (field) { !this.state.editing ? this.setState({editing: field}) : this.setState({editing: false}) }

  handleSbChange (field) {
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, { [field]: this.state[field] }))
    this.setState({editing: false})
  }

  buildMessages (expires, userID, creator, createdAt, alias) { return <div className='other-sb-info'>{expiresMessage(expires)}{creatorMessage(userID, creator, createdAt, alias)}{this.editMessage()}{authMessage(userID)}</div> }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0 || typeof this.props.sb.choices === 'undefined') return null
    const taglist = this.props.sb.tags && this.props.sb.tags.length > 0 ? this.props.sb.tags.map((tag) => <span key={tag.text}>{tag.text}</span>) : null
    const editor = (field) => <div className='editor' onClick={() => this.updateField(field)}><FA name='pencil' className='fa fa-fw' /></div>
    const editForm = (editField) => {
      return (
        <span className='edit-form' >
          <input type='text' id={`edit-${editField}`} placeholder={`Enter new ${editField} here`} value={this.state[editField]} onChange={(e) => this.setState({[editField]: e.currentTarget.value})} />
          <div className='button' onClick={() => this.handleSbChange(editField)}>Save</div>
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
        <div id='sort-options'>
          sort by:&nbsp;&nbsp;
          <div className={classnames(sortClasses('votes'))} onClick={() => this.setState({sortType: 'votes'})}>votes</div>
          <div className={classnames(sortClasses('AZ'))} onClick={() => this.setState({sortType: 'AZ'})}>A→Z</div>
          <div className={classnames(sortClasses('date'))} onClick={() => this.setState({sortType: 'date'})}>date added</div>
        </div>
      )
    }

    return (
      <div className='snowballots-section'>
        <FavoritePanel favorited={this.state.favorited} onClick={() => this.favoriteSnowballot(this.props.sb.id)} />
        {this.state.tags && this.state.tags.length > 0 && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        <h4 className='sb-title'>{this.props.sb.title}</h4>{isCreator(this.props.user.uid, this.props.sb.creator) && editor('title')}
        {this.state.editing && editForm('title')}
        {this.state.mainImage && <img id='image-holder-main' src={this.state.mainImage} />}
        <div id='sb-description-text'>{this.props.sb.description || null}</div>
        {sortOptions()}
        <SbChoices sortType={this.state.sortType} choices={this.props.sb.choices} userID={this.props.user.uid} expires={this.state.expires} userChoice={this.props.sb.userChoice} onAdd={() => this.setState({showAddForm: true})} />
        {this.state.showAddForm && this.showAddChoice(this.state.expires)}
      </div>
    )
  }

  render () {
    const { creator, createdAt, alias } = this.props.sb
    const userID = this.props.user.uid
    return (
      <div id='sb-detail'>
        <SharePanel alias={alias} />
        <div className='above-sb-container'>{this.buildMessages(this.state.expires, userID, creator, createdAt, alias)}</div>
        <div className='detail-snowballot-container'>{this.renderSb()}</div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
