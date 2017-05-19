import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import ReactModal from 'react-modal'
import DateTime from 'react-datetime'
import * as actions from '.././actions'
import { imagesRef } from '../firebase/constants'
import OptionPanel from './OptionPanel'
import FavoritePanel from './FavoritePanel'
import FormInput from './FormInput'
import DeleteModal from './DeleteModal'
import SbChoices from './SbChoices'
import SharePanel from './SharePanel'
import { modalStyles, createStateFromProps } from 'utilities/generalUtils'
import { isCreator, previewImage, updateImage } from 'utilities/sbUtils'
import { creatorMessage, expiresMessage, authMessage } from 'utilities/markupUtils'

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {}
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
          <ReactModal id='edit-options-modal' contentLabel='delete-sb' isOpen={this.state.showOptionsModal} className='Modal' overlayClassName='Overlay' style={modalStyles}>
            <div id='close-modal' onClick={() => this.toggleModal('showOptionsModal')}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top'>
              Edit Snowballot Options
            </div>
            <OptionPanel
              handleOptionToggle={(e) => this.setState({[e.target.id]: !this.state[e.target.id]})}
              setDate={data => this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')})}
              toggleAlias={(e) => this.setState({alias: e.target.value})}
              deletion={() => { this.setState({hasMainImage: false, mainImage: undefined}, () => this.setUpEventHandling(this.state.choices)) }}
              toggleDescription={(e) => this.setState({description: e.target.value})}
              handleAdd={(tag) => this.handleAddTag(tag, () => { this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {tags: this.state.tags})) })}
              handleDelete={(i) => this.handleDeleteTag(i, () => { this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {tags: this.state.tags})) })}
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

  handleDeleteTag (i, cb) { this.setState({tags: this.state.tags.splice(i, 1)}, cb) }

  handleAddTag (tag, cb) { this.setState({tags: this.state.tags.push({id: this.state.tags.length + 1, text: tag})}, cb) }

  updateField (field) { !this.state.editing ? this.setState({editing: field}) : this.setState({editing: false}) }

  handleSbChange (field) {
    this.props.dispatch(actions.startUpdateSb(this.props.sb.id, { [field]: this.state[field] }))
    this.setState({editing: false})
  }

  buildMessages (expires, userID, creator, createdAt, alias) { return <div className='other-sb-info'>{expiresMessage(expires)}{creatorMessage(userID, creator, createdAt, alias)}{this.editMessage()}{authMessage(userID)}</div> }

  renderSb () {
    if (!this.props.sb || this.props.sb.length === 0 || typeof this.props.sb.choices === 'undefined') return null
    const taglist = this.state.tags.length > 0 ? this.state.tags.map((tag) => <span key={tag.text}>{tag.text}</span>) : null
    const editor = (field) => <div className='editor' onClick={() => this.updateField(field)}><FA name='pencil' className='fa fa-fw' /></div>
    const label = 'title'
    return (
      <div className='snowballots-section'>
        <FavoritePanel favorited={this.state.favorited} onClick={() => this.favoriteSnowballot(this.props.sb.id)} />
        {this.state.tags.length > 0 && <div className='tag-list'><FA name='tags' className='fa fa-fw' />{taglist}</div>}
        <h4 className='sb-title'>{this.props.sb.title}</h4>{isCreator(this.props.user.uid, this.props.sb.creator) && editor('title')}
        {this.state.editing && <FormInput label={label} value={this.state[label]} onClick={(e) => this.setState({[label]: e.currentTarget.value})} onChange={() => this.handleSbChange(label)} /> }
        {this.state.mainImage && <img id='image-holder-main' src={this.state.mainImage} />}
        <div id='sb-description-text'>{this.props.sb.description || null}</div>
        <SbChoices choices={this.state.choices} expires={this.state.expires} userChoice={this.state.userChoice} userID={this.props.user.uid} />
      </div>
    )
  }

  render () {
    const { creator, createdAt, alias } = this.props.sb
    const userID = this.props.user.uid
    return (
      <div id='sb-detail'>
        <SharePanel />
        <div className='above-sb-container'>{this.buildMessages(this.state.expires, userID, creator, createdAt, alias)}</div>
        <div className='detail-snowballot-container'>{this.renderSb()}</div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
