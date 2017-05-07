import React from 'react'
import FA from 'react-fontawesome'

class Choice extends React.Component {
  render () {
    return (
      <span id='choice'>
        <div
          id={`choice-container-choice-${this.props.choice.id}`}
          className='choice-container input-group'
        >
          <FA
            id={`choice-${this.props.choice.id}`}
            name={this.props.choicesExpanded[`choice-${this.props.choice.id}`] ? 'compress' : 'ellipsis-h'}
            className='input-group-button fa fa-fw choice-expand'
            onClick={(e) => this.props.toggleChoiceOptions(e, this.props.choicesExpanded)}
          />
          <input
            className='choice-input input-group-field'
            id={`choice-${this.props.choice.id}`}
            value={this.props.choice.title}
            type='text'
            placeholder={`Enter name of Choice ${this.props.choice.id}`}
            onKeyDown={this.props.checkTab}
            onChange={(e) => this.props.choiceUpdate(e, 'title')}
          />
          <FA
            key={`delete-${this.props.choice.id}`}
            id={`delete-${this.props.choice.id}`}
            className='fa fa-fw delete-choice-button button input-group-button'
            name='close'
            onClick={this.props.deleteChoice}
          />
        </div>
      </span>
    )
  }
}

export default Choice
