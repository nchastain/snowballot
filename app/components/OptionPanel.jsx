import React from 'react'
import OptionUnit from './OptionUnit'
import FA from 'react-fontawesome'

const OptionPanel = (props) => {
  const {
    didExpire,
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
    optionsExpanded = true,
    showButton = true
  } = props
  const label = (type) => {
    const hidden = type === 'hidden'
    return (
      <div style={{fontSize: '80%', verticalAlign: 'middle'}}>
        {hidden ? 'SHOW' : 'HIDE'}
      </div>
    )
  }
  return (
    <span id='options-panel' className='newSbOptions newSbSection'>
      {showButton && <div id='options-top' onClick={() => toggleMenu()}>
        <div id='toggleOptionsMenu' onClick={() => toggleMenu()}>
          {optionsExpanded ? label() : label('hidden') }
        </div>
      </div>}
      <div id='real-options-section' className={optionsExpanded ? 'expanded' : ''}>
        <OptionUnit
          name='expire'
          didExpire={didExpire}
          toggle={(e) => handleOptionToggle(e)}
          setDate={(data) => setDate(data)}
        />
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
          name='alias'
          isPrivate={isPrivate}
          alias={alias}
          toggle={(e) => toggleAlias(e)}
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
      </div>
    </span>
  )
}

export default OptionPanel
