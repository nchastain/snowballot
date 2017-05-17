import React from 'react'
import OptionUnit from './OptionUnit'

const OptionPanel = (props) => {
  const {
    doesExpire,
    handleOptionToggle,
    setDate,
    isPrivate,
    alias,
    toggleAlias,
    extensible,
    hasMainImage,
    deletion,
    description,
    toggleDescription,
    handleAdd,
    handleDelete,
    tags,
    suggestions
  } = props
  return (
    <span>
      <OptionUnit
        name='expire'
        doesExpire={doesExpire}
        toggle={(e) => handleOptionToggle(e)}
        setDate={(data) => setDate(data)}
      />
      <OptionUnit
        name='private'
        isPrivate={isPrivate}
        toggle={(e) => handleOptionToggle(e)}
      />
      <OptionUnit
        name='alias'
        isPrivate={isPrivate}
        alias={alias}
        toggle={(e) => toggleAlias(e)}
      />
      <OptionUnit
        name='extend'
        extensible={extensible}
        toggle={(e) => handleOptionToggle(e)}
      />
      <OptionUnit
        name='photo'
        hasMainImage={hasMainImage}
        deletion={() => deletion()}
      />
      <OptionUnit
        name='description'
        description={description}
        toggle={(e) => toggleDescription(e)}
      />
      <OptionUnit
        name='tags'
        tagAdd={handleAdd}
        tagDelete={handleDelete}
        tags={tags}
        suggestions={suggestions}
      />
    </span>
  )
}

export default OptionPanel
