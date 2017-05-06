import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import Redux from 'redux'
import DateTime from 'react-datetime'
import uuid from 'uuid'
import Tagger from './Tagger'
import Choice from './Choice'
import classnames from 'classnames'
import { imagesRef } from '../firebase/constants'
import ReactPlayer from 'react-player'
import ChoiceMediaPane from './ChoiceMediaPane'
import omit from 'object.omit'

let createHandlers = function (dispatch) {
  let handleSubmit = function (options, choices) {
    dispatch(actions.startAddSb(options, choices))
  }
  return {
    handleSubmit
  }
}

let contextForComponent

const initialState = {
  optionsExpanded: false,
  title: '',
  alias: '',
  choicesExpanded: {},
  description: '',
  doesExpire: false,
  isPrivate: false,
  isExtensible: false,
  choices: [
    {title: '', votes: 0, id: 1, info: ''},
    {title: '', votes: 0, id: 2, info: ''}
  ],
  tags: [],
  suggestions: []
}

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addChoice = this.addChoice.bind(this)
    this.choiceUpdate = this.choiceUpdate.bind(this)
    this.validateSb = this.validateSb.bind(this)
    this.deleteChoice = this.deleteChoice.bind(this)
    this.checkTab = this.checkTab.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlers = createHandlers(props.dispatch)
    this.state = initialState
    contextForComponent = this
  }

  validateSb () {
    if (this.state.title.length === 0) throw new Error('Snowballots must have a title.')
    const title = this.state.title
    const hasMainImage = this.state.hasMainImage || false
    const mainImage = this.state.mainImage || ''
    const privateAlias = this.state.privateAlias || uuid.v4().replace(/-/g, '').substring(0, 10)
    const publicAlias = this.state.alias.length > 0 ? this.state.alias : title.replace(/\s+/g, '').substring(0, 10)
    const alias = this.state.isPrivate ? privateAlias : publicAlias
    const dupesObj = {}
    const filteredChoices = this.state.choices.filter(function (choice) {
      let duplicate = false
      dupesObj[choice.title.toLowerCase()] ? duplicate = true : dupesObj[choice.title.toLowerCase()] = choice
      return choice.title.length > 0 && !duplicate
    })
    const isPrivate = this.state.isPrivate
    const expires = this.state.expires || null
    const isExtensible = this.state.isExtensible || false
    const description = this.state.description || ''
    const tags = this.state.tags || []
    if (filteredChoices.length < 2) throw new Error('Snowballots must have at least 2 choices.')
    const options = {
      title: title,
      alias: alias,
      privateAlias: privateAlias,
      isPrivate: isPrivate,
      expires: expires,
      isExtensible: isExtensible,
      tags: tags,
      description: description,
      mainImage: mainImage,
      hasMainImage: hasMainImage
    }
    return {options, filteredChoices}
  }

  handleDelete (i) {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({tags: tags})
  }

  toggleChoiceOptions (e, choicesExpanded) {
    const infoSection = document.querySelector(`#choice-more-info-${e.target.id}`)
    const expandState = Boolean(!choicesExpanded[e.target.id])
    infoSection.classList.toggle('choice-more-info-expanded')
    contextForComponent.setState({choicesExpanded: {...choicesExpanded, [e.target.id]: expandState}})
  }

  handleAdd (tag) {
    let tags = this.state.tags
    tags.push({
      id: tags.length + 1,
      text: tag
    })
    this.setState({tags: tags})
  }

  setGIF (id, gif) {
    const that = this
    if (!that.state) return
    const updatedChoices = that.state.choices.map((choice) => {
      if (choice.id === id) {
        choice.GIF = gif.downsized.url
        choice.hasGIF = true
      }
      return choice
    })
    const imageToSet = document.querySelector(`#gif-${id}`)
    imageToSet.src = gif.downsized.url
    that.setState({choices: updatedChoices})
  }

  choiceImageUpdate (id, choices, uploadedFile) {
    const updatedChoices = choices.map((choice) => {
      if (choice.id === id) {
        choice.photo = uploadedFile
        choice.hasImage = true
      }
      return choice
    })
    return updatedChoices
  }

  previewImage (file, choiceId) {
    let img = document.querySelector(`#gallery-img-${choiceId}`)
    let reader = new FileReader()
    reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result } })(img)
    reader.readAsDataURL(file)
  }

  setUpEventHandling (choices) {
    if (!document.querySelector('.file-input')) return

    let uploaders = [...document.getElementsByClassName('file-input')]
    const that = this
    uploaders.forEach(function (elem) {
      elem.addEventListener('change', function () {
        let files = this.files
        const choiceId = elem.id === 'file-input-main' ? 'main' : parseInt(elem.id.match(/\d+$/).join(''))
        that.previewImage(files[0], choiceId)
        if (choiceId === 'main') that.setState({hasMainImage: true, mainImage: files[0]})
        else that.setState(that.choiceImageUpdate(choiceId, choices, files[0]))
      }, false)
    })
  }

  renderChoices () {
    let that = this
    return this.state.choices.map((choice) => (
      <span key={`choice-container-${choice.id}`}>
        <Choice
          choice={choice}
          choicesExpanded={that.state.choicesExpanded}
          toggleChoiceOptions={that.toggleChoiceOptions}
          checkTab={that.checkTab}
          choiceUpdate={that.choiceUpdate}
          deleteChoice={that.deleteChoice}
        />
        <ChoiceMediaPane id={choice.id} choices={this.state.choices} />
      </span>
    ))
  }

  addImage (alias, choiceId, file) {
    let newImageRef = imagesRef.child(`${alias}/${choiceId}`)
    newImageRef.put(file).then(() => console.log('Uploaded a file!'))
  }

  addAllImages (alias) {
    const that = this
    this.state.choices.forEach(function (choice) {
      if (choice.photoFile) that.addImage(alias, choice.id, choice.photoFile)
    })
    if (this.state.hasMainImage) this.addImage(alias, 'main', this.state.mainImage)
  }

  addAlias () {
    const pAlias = uuid.v4().replace(/-/g, '').substring(0, 10)
    this.setState({privateAlias: pAlias})
  }

  handleSubmit (e) {
    e.preventDefault()
    this.addAlias()
    this.choiceExtraUpdate()
    const validSb = this.validateSb()
    this.setState(initialState, function () {
      this.setState({choices: [ //  not only do I have to inexplicably use a callback here, but I have to specify this piece of state.
        {title: '', votes: 0, id: 1, info: ''},
        {title: '', votes: 0, id: 2, info: ''}
      ]})
    })
    this.handlers.handleSubmit(validSb.options, validSb.filteredChoices)
    this.addAllImages(validSb.options.privateAlias)
    this.props.history.push(`/sbs/${validSb.options.alias}`)
  }

  choiceExtraUpdate () {
    const { createdSb } = this.props
    let updatedChoices = this.state.choices
    let choices = Object.keys(createdSb)
    const excluded = ['expanded', 'included', 'id', 'photoFile']
    let propertyList = []
    choices.forEach((choice) => {
      let potentialProperties = Object.keys(createdSb[choice])
      potentialProperties.forEach((pp) => {
        if (excluded.indexOf(pp) === -1 && propertyList.indexOf(pp) === -1) propertyList.push(pp)
      })
    })
    propertyList.forEach((property) => {
      const extraMedia = Object.keys(createdSb).map(choice => createdSb[choice][property])
      updatedChoices = updatedChoices.map((choice, idx) => {
        choice[property] = extraMedia[idx] || ''
        return choice
      })
    })
    this.setState({ choices: updatedChoices })
  }

  choiceUpdate (e, property) {
    const position = parseInt(e.target.id.match(/\d+$/).join(''))
    const updatedChoices = this.state.choices.map((choice) => {
      if (choice.id === position) choice[property] = e.target.value
      return choice
    })
    this.setState({ choices: updatedChoices })
  }

  checkTab (e) {
    // checks if user pressed tab key and on last input
    const idx = parseInt(e.target.id.match(/\d+$/).join(''))
    if (e.keyCode === 9 && idx === this.state.choices.length) {
      this.addChoice()
    }
  }

  addChoice () {
    const newChoice = {
      title: '',
      votes: 0,
      id: this.state.choices.length + 1
    }
    this.setState({
      choices: [...this.state.choices, newChoice]
    })
  }

  deleteChoice (e) {
    const idx = parseInt(e.target.id.match(/\d+$/).join(''))
    const updatedChoices = this.state.choices.filter((choice) => {
      return choice.id !== idx
    })
    this.setState({choices: updatedChoices})
  }

  toggleOptionsMenu () {
    this.setState({optionsExpanded: !this.state.optionsExpanded})
  }

  handleOptionToggle (e) {
    switch (e.target.id) {
      case 'option-expire':
        this.setState({doesExpire: !this.state.doesExpire})
        break
      case 'option-private':
        this.setState({isPrivate: !this.state.isPrivate})
        break
      case 'option-extensible':
        this.setState({isExtensible: !this.state.isExtensible})
        break
      default:
        break
    }
  }

  render () {
    this.setUpEventHandling(this.state.choices)
    const showToggleText = <div style={{fontSize: '80%'}}>SHOW OPTIONS<FA name='caret-right' className='fa-2x fa-fw' /></div>
    const hideToggleText = <div style={{fontSize: '80%'}}>HIDE OPTIONS<FA name='caret-down' className='fa-2x fa-fw' /></div>
    const publicAlias = <span>Add a custom URL?&#58; snowballot.com&#47;sbs&#47;</span>
    const privateAlias = <span className='disabled-option'>(Sorry, custom URLs are only available for public snowballots.)</span>
    const optionsClass = {
      expanded: this.state.optionsExpanded
    }
    const datePicker = (
      <div>
        <DateTime
          inputProps={{placeholder: 'Enter an expiration date'}}
          value={this.state.expires || ''}
          onChange={(data) => this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')})}
          closeOnSelect
        />
      </div>
    )

    return (
      <span id='add-form'>
        <h1 className='create-title'>🌨 Create a Snowballot</h1>
        <div className='newSnowballot-section'>
          <form id='newSnowballotForm' ref='addSnowballotForm' onSubmit={this.handleSubmit}>
            <input
              id='title-input'
              type='text'
              value={this.state.title}
              placeholder='Enter title of new snowballot'
              onChange={(e) => this.setState({title: e.target.value})}
            />
            <div className='newSbOptions newSbSection'>
              <div id='options-top' onClick={() => this.toggleOptionsMenu()}>
                <div className='header'>Options</div>
                <div id='toggleOptionsMenu' onClick={() => this.toggleOptionsMenu()}>{this.state.optionsExpanded ? hideToggleText : showToggleText}</div>
              </div>
              <div id='real-options-section' className={classnames(optionsClass)}>

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
                      name={this.state.doesExpire ? 'check-circle' : 'circle'}
                      className='fa fa-fw custom-check'
                      onClick={(e) => this.handleOptionToggle(e)}
                    />
                  </div>
                  <div className='options-rest'>
                    {this.state.doesExpire && datePicker}
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
                      className='fa fa-fw custom-check'
                      onClick={(e) => this.handleOptionToggle(e)}
                    />
                  </div>
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
                  <div className='options-selector'>
                    <input
                      type='text'
                      value={this.state.alias}
                      onChange={(e) => this.setState({alias: e.target.value})}
                    />
                  </div>}
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
                      className='fa fa-fw custom-check'
                      onClick={(e) => this.handleOptionToggle(e)}
                    />
                  </div>
                </div>

                {/* Photo */}
                <div className='options-unit'>
                  <div className='options-icon'>
                    <FA name='photo' className='fa-2x fa-fw' />
                  </div>
                  <div className='options-unit-text'>
                    Add a photo for this snowballot?
                  </div>
                  <div className='options-rest'>
                    <div className='photo-uploader' id={'photo-upload-main'}>
                      <input type='file' className='file-input' id={'file-input-main'} />
                      <div id={'gallery-main'}>
                        <img className='gallery-image' id={'gallery-img-main'} src='' />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className='options-unit'>
                  <div className='options-icon'>
                    <FA name='pencil' className='fa-2x fa-fw' />
                  </div>
                  <div className='options-unit-text'>
                    Add a description for this snowballot?
                  </div>
                  <div className='options-rest'>
                    <textarea
                      rows={3}
                      value={this.state.description}
                      onChange={(e) => this.setState({description: e.target.value})}
                      style={{width: '500px'}}
                    />
                  </div>
                </div>

              </div>
            </div>
            <div className='newSbSection newSbChoices'>
              <div className='header'>Choices</div>
              {this.renderChoices()}
              <div id='addchoice' className='button secondary' onClick={this.addChoice}><FA name='plus' className='fa fa-fw' /> add choice</div>
            </div>
            <div id='submitSnowballot' className='button primary' onClick={this.handleSubmit}><FA name='plus' className='fa fa-fw' /> create snowballot</div>
          </form>
        </div>
      </span>
    )
  }
}

export default connect(state => state)(AddForm)
