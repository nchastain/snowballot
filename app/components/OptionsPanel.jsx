import React from 'react'
import FA from 'react-fontawesome'
import DateTime from 'react-datetime'
import OptionUnit from './OptionUnit'
import Tagger from './Tagger'

class OptionsPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      doesExpire: false
    }
  }
  render () {
    const publicAlias = <span>Add a custom URL?&#58; snowballot.com&#47;sbs&#47;</span>
    const privateAlias = (
      <span className='disabled-option'>
        (Sorry, custom URLs are only available for public snowballots.)
      </span>
    )
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
    const getExtra = function () {
      let extra = {}

      /* LV */
      extra.LV.selector = `${
        <FA
          id='option-expire'
          name={this.state.doesExpire ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => this.handleOptionToggle(e)}
        />
      }`
      extra.lockVoting.rest = `${this.state.doesExpire && datePicker}`
      extra.lockVoting.label = 'Lock voting on snowballot after certain time?'

      /* PP */
      extra.privatePublic.selector = `${
        <FA
          id='option-private'
          name={this.state.isPrivate ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => this.handleOptionToggle(e)}
        />
      }`

      /* UA */
      extra.urlAlias.selector = `${
        this.state.isPrivate && <input
          type='text'
          value={this.state.alias}
          onChange={(e) => this.setState({alias: e.target.value})}
        />
      }`
      extra.urlAlias.label = `${this.state.isPrivate ? privateAlias : publicAlias}`

      /* EX */
      extra.ext.selector = `${
        <FA
          id='option-extensible'
          name={this.state.isExtensible ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => this.handleOptionToggle(e)}
        />
      }`
      extra.ext.iconName = `${this.state.isExtensible ? 'check-circle' : 'circle'}`
      extra.ext.label = 'Allow others to add new choices?'

      /* MP */
      extra.mainPhoto.rest = `${
        <div className='photo-uploader' id={'photo-upload-main'}>
          <input type='file' className='file-input' id={'file-input-main'} />
          <div id={'gallery-main'}>
            <img className='gallery-image' id={'gallery-img-main'} src='' />
          </div>
        </div>
      }`

      /* TG */
      extra.tags.rest = `${
        <Tagger
          className='tag-holder'
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
          tags={this.state.tags}
          suggestions={this.state.suggestions}
        />
      }`

      /* DE */
      extra.description.rest = `${
        <textarea
          rows={3}
          value={this.state.description}
          onChange={(e) => this.setState({description: e.target.value})}
          style={{width: '500px'}}
        />
      }`

      return extra
    }
    const { lockVoting, privatePublic, urlAlias, ext, mainPhoto, tags, description } = getExtra()
    const OptionsUnitInfo = [
      /* LV */ {iconName: 'calendar-times-o', label: lockVoting.label, selector: lockVoting.selector, rest: lockVoting.rest},
      /* PP */{iconName: 'eye-slash', label: 'Make snowballot private?', selector: privatePublic.selector, rest: ''},
      /* UA */{iconName: 'snowflake-o', label: urlAlias.label, selector: urlAlias.selector, rest: ''},
      /* EX */{iconName: ext.iconName, label: ext.label, selector: ext.selector, rest: ''},
      /* MP */{iconName: 'photo', label: 'Add a photo for this snowballot?', selector: '', rest: mainPhoto.rest},
      /* TG */{iconName: 'tags', label: 'Add tags to this snowballot?', selector: '', rest: tags.rest},
      /* DE */{iconName: 'pencil', label: 'Add a description for this snowballot?', selector: '', rest: description.rest}
    ]
    const optionUnits = OptionsUnitInfo.map(oU => <OptionUnit {...oU} />)
    return <div className='options-panel'>{ optionUnits }</div>
  }
}

export default OptionsPanel
