import React from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import moment from 'moment'
import * as actions from '.././actions'
import DateTime from 'react-datetime'
import { imagesRef } from '../firebase/constants'
import OptionPanel from './OptionPanel'
import ChoicePanel from './ChoicePanel'
import { previewImage, initialState, validateSb } from '.././utilities/sbUtils'

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {...initialState, showOptions: false, showChoices: false, error: ''}
  }

  componentWillMount () {
    window.scrollTo(0,0)
    this.setState({choices: [
      {title: '', votes: 0, id: 1, info: '', added: 1495860030876},
      {title: '', votes: 0, id: 2, info: '', added: 1495860030877}
    ]}, function () {
    })
  }

  handleDelete (i) {
    const newTags = [...this.state.tags.slice(0, i), ...this.state.tags.slice(i + 1)]
    this.setState({tags: newTags})
  }

  handleAdd (tag) {
    if (this.state.tags.length >= 7) return
    const newTags = [...this.state.tags, {id: this.state.tags.length + 1, text: tag}]
    this.setState({tags: newTags})
  }

/*  setGIF (id, gif) {
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
*/

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
    const aliases = this.props.sbs.map(sb => sb.alias)
    let shouldAdvance = true
    if (aliases.indexOf(validSb.options.alias) !== -1) {
      this.setState({errorType: 'alias', errorText: 'That custom URL has already been taken'})
      shouldAdvance = false
    }
    else {
      this.props.dispatch(actions.startAddSb(validSb.options, validSb.filteredChoices))
      this.addAllImages(validSb.options.privateAlias)
      this.setState({...initialState})
    }
    if (shouldAdvance) this.props.history.push(`/sbs/${validSb.options.alias}`)
  }

  choiceExtraUpdate () {
    const that = this
    const updatedChoices = this.state.choices.map(function (choice) {
      if (that.props.createdSb[choice.id]) {
        choice.info = that.props.createdSb[choice.id].info || ''
        // choice.GIF = that.props.createdSb[choice.id].GIF || ''
        choice.youtube = that.props.createdSb[choice.id].youtube || ''
        choice.link = that.props.createdSb[choice.id].link || ''
        choice.photo = that.props.createdSb[choice.id].photo || ''
      }
      return choice
    })
    this.setState({ choices: updatedChoices })
  }

  buildOptionPanel () {
    const stateProps = {...this.state}
    return (
      <OptionPanel
        handleOptionToggle={(e, specifier) => {
          if (specifier === 'expires') {
            this.setState({[e.currentTarget.id]: !this.state[e.currentTarget.id], expires: moment().add(1, 'week').format('MM/DD/YYYY')})
          }
          if (!specifier) this.setState({[e.target.id]: !this.state[e.target.id]})
          else this.setState({[e.currentTarget.id]: !this.state[e.currentTarget.id]})
        }}
        setDate={data => this.setState(
          {expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')}
        )}
        toggleAlias={(e) => this.setState({alias: e.target.value, errorType: this.state.errorType === 'alias' ? '' : this.state.errorType, errorText: this.state.errorType === 'alias' ? '' : this.state.errorType})}
        deletion={() => this.setUpEventHandling(this.state.choices)}
        toggleDescription={(e) => this.setState({description: e.target.value})}
        handleAdd={(tag) => this.handleAdd(tag)}
        handleDelete={(i) => this.handleDelete(i)}
        tags={this.state.tags}
        toggleMenu={() => this.setState({optionsExpanded: !this.state.optionsExpanded})}
        error={this.state.errorType}
        {...stateProps}
        showButton
        optionsExpanded
      />
    )
  }

  showButtonForStep () {
    const choicesValid = () => {
      return this.state.choices &&
      this.state.choices.length >= 2 &&
      this.state.choices[0].title !== '' &&
      this.state.choices[1].title !== '' &&
      this.state.choices[0].title.toLowerCase() !== this.state.choices[1].title.toLowerCase()
    }
    let contentToDisplay
    const noTitleButton = <div className='sbCreationButton action-required button primary'>Enter a title above</div>
    const submitButton = <div className='sbCreationButton button primary' onClick={(e) => this.handleSubmit(e)}><FA name='arrow-right' className='fa fa-fw' /> submit snowballot</div>
    const showChoicesButton = <div className='sbCreationButton button primary' onClick={() => this.setState({showChoices: true})}><FA name='arrow-right' className='fa fa-fw' /> next: choices</div>
    const choicesInvalidButton = <div className='sbCreationButton action-required button primary'>Enter at least two choices</div>
    const toOptionsButton = <div className='sbCreationButton button primary' onClick={() => this.setState({showOptions: true})}><FA name='arrow-right' className='fa fa-fw' /> next: options</div>
    if (!this.state.title || this.state.title.length === 0) contentToDisplay = noTitleButton
    else if (this.state.showChoices && this.state.showOptions && choicesValid()) contentToDisplay = submitButton
    else if (this.state.showChoices) contentToDisplay = choicesValid() ? toOptionsButton : choicesInvalidButton
    else contentToDisplay = showChoicesButton
    return this.state.errorText ? <div className='sbCreationButton action-required button primary'>{this.state.errorText}</div> : contentToDisplay 
  }

  handleTitleChange (e) {
    if (e.keyCode === 13 || e.keyCode === 9) {
      if (e.keyCode === 13) e.preventDefault()
      if (this.state.title.length > 0) document.querySelector('.sbCreationButton').click()
    }
  }

  render () {
    return (
      <span id='add-form'>
        <h1 className='create-title'>Create a Snowballot</h1>
        <div id='outer-add-form-container'>
          <div className='newSnowballot-section'>
            <form id='newSnowballotForm' ref='addSnowballotForm' onSubmit={(e) => this.handleSubmit(e)}>
              <input id='title-input' type='text' value={this.state.title} placeholder='Enter title of new snowballot' onChange={(e) => this.setState({title: e.target.value})} onKeyDown={(e) => this.handleTitleChange(e)} />
              {this.state.showChoices && <ChoicePanel choices={this.state.choices} choicesExpanded={this.state.choicesExpanded} update={(field, updates) => this.setState({[field]: updates})} />}
              {this.state.showOptions && this.buildOptionPanel()}
            </form>
          </div>
          <div className='sbCreationAccent'>''</div>
          {this.showButtonForStep()}
        </div>
      </span>
    )
  }
}

export default connect(state => state)(AddForm)
