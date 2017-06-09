import React from 'react'
import OptionUnit from './OptionUnit'
import FA from 'react-fontawesome'

const OptionPanel = (props) => {
  const {
    didExpire,
    expires,
    handleOptionToggle,
    setDate,
    isPrivate,
    alias,
    toggleAlias,
    isExtensible,
    description,
    toggleDescription,
    handleAdd,
    handleDelete,
    tags,
    suggestions,
    toggleMenu,
    save,
    showSave = false,
    optionsExpanded = true,
    showButton = true
  } = props
  return (
    <span id='options-panel' className='newSbOptions newSbSection'>
      <div id='real-options-section' className={optionsExpanded ? 'expanded' : ''}>
        <OptionUnit
          name='private'
          isPrivate={isPrivate}
          toggle={(e) => handleOptionToggle(e)}
        />
        <OptionUnit
          name='extend'
          extensible={isExtensible}
          toggle={(e) => handleOptionToggle(e)}
        />
        <OptionUnit
          name='expire'
          didExpire={didExpire}
          expires={expires}
          toggle={(e) => handleOptionToggle(e)}
          setDate={(data) => setDate(data)}
        />
        <OptionUnit
          name='alias'
          isPrivate={isPrivate}
          alias={alias}
          toggle={(e) => toggleAlias(e)}
          save={(e) => save(e)}
          showSave={showSave}
        />
        <OptionUnit
          name='description'
          description={description}
          toggle={(e) => toggleDescription(e)}
          save={(e) => save(e)}
          showSave={showSave}
        />
        <OptionUnit
          name='tags'
          tagAdd={handleAdd}
          tagDelete={handleDelete}
          tags={tags}
          suggestions={suggestions}
        />
      </div>
    </span>
  )
}

export default OptionPanel
