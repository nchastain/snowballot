import React from 'react'
import ReactDOM from 'react-dom'
import { WithContext as ReactTags } from 'react-tag-input'

class Tagger extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { tags, suggestions, handleDelete, handleAdd } = this.props
    return (
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={handleDelete}
        handleAddition={handleAdd}
      />
    )
  }
}

export default Tagger
