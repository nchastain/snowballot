import React from 'react'
import { WithContext as ReactTags } from 'react-tag-input'

const Tagger = ({ tags, suggestions, handleDelete, handleAdd }) => (
  <ReactTags
    id='tagger'
    tags={tags}
    suggestions={suggestions}
    handleDelete={handleDelete}
    handleAddition={tags.length <= 6 && handleAdd}
    placeholder={tags.length <= 6 ? 'Add tag, press Enter' : 'Maximum of 7 tags'}
  />
)

export default Tagger
