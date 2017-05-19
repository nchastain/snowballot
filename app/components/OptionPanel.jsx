import React from 'react'
import OptionUnit from './OptionUnit'
import FA from 'react-fontawesome'

const OptionPanel = (props) => {
  const {
    doesExpire,
    handleOptionToggle,
    setDate,
    isPrivate,
    alias,
    toggleAlias,
    isExtensible,
    hasMainImage,
    deletion,
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
      <div style={{fontSize: '80%'}}>
        {hidden ? 'SHOW' : 'HIDE'} OPTIONS
        <FA name={hidden ? 'caret-right' : 'caret-down'} className='fa-2x fa-fw' />
      </div>
    )
  }
  return (
    <span id='options-panel' className='newSbOptions newSbSection'>
      {showButton && <div id='options-top' onClick={() => toggleMenu()}>
        <div className='header'>Options</div>
        <div id='toggleOptionsMenu' onClick={() => toggleMenu()}>
          {optionsExpanded ? label() : label('hidden') }
        </div>
      </div>}
      <div id='real-options-section' className={optionsExpanded ? 'expanded' : ''}>
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
          extensible={isExtensible}
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
      </div>
    </span>
  )
}

export default OptionPanel
