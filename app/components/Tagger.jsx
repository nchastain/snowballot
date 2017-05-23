import React from 'react'
import { WithContext as ReactTags } from 'react-tag-input'

const Tagger = ({ tags, suggestions, handleDelete, handleAdd }) => (
  <ReactTags
    id='tagger'
    tags={tags}
    suggestions={suggestions}
    handleDelete={handleDelete}
    handleAddition={handleAdd}
    placeholder='Add tag, press &#39;Enter&#39;'
  />
)

export default Tagger
