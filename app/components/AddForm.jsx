import React from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import DateTime from 'react-datetime'
import { imagesRef } from '../firebase/constants'
import OptionPanel from './OptionPanel'
import ChoicePanel from './ChoicePanel'
import { previewImage, initialState, validateSb } from '.././utilities/sbUtils'

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = initialState
  }

  handleDelete (i) { this.setState({tags: this.state.tags.splice(i, 1)}) }

  handleAdd (tag) { this.setState({tags: this.state.tags.push({id: this.state.tags.length + 1, text: tag})}) }

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
    return choices.map((choice) => {
      if (choice.id === id) {
        choice.photo = uploadedFile
        choice.hasImage = true
      }
      return choice
    })
  }

  setUpEventHandling (choices) {
    if (!document.querySelector('.file-input')) return
    let uploaders = [...document.getElementsByClassName('file-input')]
    const that = this
    uploaders.forEach(function (elem) {
      elem.addEventListener('change', function () {
        let files = this.files
        const choiceId = parseInt(elem.id.match(/\d+$/).join(''))
        previewImage(files[0], `#gallery-img-${choiceId}`)
        that.setState(that.choiceImageUpdate(choiceId, choices, files[0]))
      }, false)
    })
  }

  addImage (alias, choiceId, file) {
    let newImageRef = imagesRef.child(`${alias}/${choiceId}`)
    newImageRef.put(file).then(() => console.log('Uploaded a file!'))
  }

  addAllImages (alias) {
    const that = this
    this.state.choices.forEach(function (choice) { if (choice.photoFile) that.addImage(alias, choice.id, choice.photoFile) })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.choiceExtraUpdate()
    const validSb = validateSb(this.state)
    this.setState({...initialState})
    this.props.dispatch(actions.startAddSb(validSb.options, validSb.filteredChoices))
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

  buildOptionPanel () {
    const stateProps = {...this.state}
    return (
      <OptionPanel
        handleOptionToggle={(e) => this.setState({[e.target.id]: !this.state[e.target.id]})}
        setDate={data => this.setState(
          {expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')}
        )}
        toggleAlias={(e) => this.setState({alias: e.target.value})}
        deletion={() => this.setUpEventHandling(this.state.choices)}
        toggleDescription={(e) => this.setState({description: e.target.value})}
        handleAdd={(tag) => this.handleAdd(tag)}
        handleDelete={(i) => this.handleDelete(i)}
        tags={this.state.tags}
        toggleMenu={() => this.setState({optionsExpanded: !this.state.optionsExpanded})}
        {...stateProps}
      />
    )
  }

  render () {
    return (
      <span id='add-form'>
        <div id='outer-add-form-container'>
          <h1 className='create-title'>Create a Snowballot</h1>
          <div className='newSnowballot-section'>
            <form id='newSnowballotForm' ref='addSnowballotForm' onSubmit={(e) => this.handleSubmit(e)}>
              <input id='title-input' type='text'value={this.state.title} placeholder='Enter title of new snowballot' onChange={(e) => this.setState({title: e.target.value})} />
              <ChoicePanel choices={this.state.choices} choicesExpanded={this.state.choicesExpanded} update={(field, updates) => this.setState({[field]: updates})} />
              {this.buildOptionPanel()}
            </form>
          </div>
          <div id='submitSnowballot' className='button primary' onClick={(e) => this.handleSubmit(e)}><FA name='plus' className='fa fa-fw' /> create snowballot</div>
        </div>
      </span>
    )
  }
}

export default connect(state => state)(AddForm)
