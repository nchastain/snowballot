import React from 'react'
import classnames from 'classnames'
import FA from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'
import ReactPlayer from 'react-player'
import { didExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { addCommas } from 'utilities/generalUtils'

const ChoiceCard = (props) => {
  
  const {choice, expires, userID, userVote, vote, choices} = props
  const buildModal = () => undefined
  const isLeader = function (choice) { 
    return 
      didExpire(expires) && 
      getVoteSum(choices) > 0 && 
      choice.id === findLeader(choices).id 
  }

  const backgrounds = ['#54D19F', '#5192E8', '#DE80FF', '#E83442', '#FFAC59', 'coral', '#F19BA1']
    
  const lightBackgrounds = ['#87FFD2', '#84C5FF', '#FFD1FF', '#FF6775', '#FFDF8C', '#FFB283', '#FFCED4']

  const choiceCardClasses = () => classnames(
    {
      'box-header': true,
      'clearfix': true,
      'choice-card': true,
      'expired-box': didExpire(expires)
    }
  )

  const hasExtraMedia = choice => choice.photo || choice.info || choice.link || choice.youtube

  const addExtraMedia = (choice) => {
    return (
      <span>
        {choice.info && mediaIcon('info', 'file-text-o', choice)}
        {choice.photo && mediaIcon('photo', 'picture-o', choice)}
        {choice.youtube && mediaIcon('youtube', 'youtube', choice)}
        {choice.link && mediaIcon('link', 'link', choice)}
        {hasExtraMedia(choice) && <span id={`icon-more-${choice.id}`} onClick={buildModal(choice, 'more')}>
          <span><span className='more-media-button' style={{color: 'white', backgroundColor: lightBackgrounds[choice.id % lightBackgrounds.length]}} data-tip data-for={`more-tooltip-${choice.id}`}><FA name='ellipsis-h' className='fa fa-fw' /></span></span>
          <ReactTooltip id={`more-tooltip-${choice.id}`} effect='solid'><span>View more media</span></ReactTooltip>
        </span>}
      </span>
    )
  }

  const mediaIcon = (name, icon, choice) => {
    return (
      <span>
        {choice[name] && <span className='icon-wrapper'>
          <span className={`icon-${name}`} id={`icon-${name}-${choice.id}`} onClick={buildModal(choice, name)}>
            <span>{choice[name] && <span className='extra-media-button' style={{color: 'white', backgroundColor: lightBackgrounds[choice.id % lightBackgrounds.length]}} data-tip data-for={`${name}-tooltip-${choice.id}`}><FA name={icon} className='fa fa-fw' /></span>}</span>
            <ReactTooltip id={`${name}-tooltip-${choice.id}`} effect='solid'><span>View {name === 'youtube' ? 'YouTube link' : name}</span></ReactTooltip>
          </span>
        </span>}
      </span>
    )
  }

  return (
    <div 
      id={`choice-container-${choice.id}`} 
      className={choiceCardClasses()}
      onClick={(e) => !userID || didExpire(expires) ? null : vote(choice.id, e)}
      style={
        {
          background: `${choice.photo ? `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${choice.photo})` : ''}`, 
          backgroundSize: '60%', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
          backgroundColor: backgrounds[choice.id % backgrounds.length]
        }
      }
    >
      <div
        className={(choice.photo || choice.youtube) ? 'photo-title' : 'title'}
        style={{backgroundColor: `${(choice.photo || choice.youtube) ? 'rgba(0,0,0,0.3)' : ''}`}}
      >
        {choice.title}
      </div>
      {choice.youtube && !choice.photo && 
      <div className='youtube-video-embed video-container'>
        <ReactPlayer 
          width={'90%'} 
          height={'50%'} 
          style={
            {
              margin: 'auto', 
              padding: '0px', 
              position: 'relative'
            }
          }
          url={choice.youtube}
          controls 
          id='react-player-youtube'
        />
      </div>
      }
      <span 
        className='vote-count' 
        style={{color: backgrounds[choice.id % backgrounds.length]}}
      >
        {addCommas(choice.votes)}
      </span>
      <div className='center-cell'>
        {choice.id === userVote &&
        <img className='check' src='.././check.png' />
        }
      </div>
      <div className='top-right-cell'>
        {isLeader(choice) && <FA name='trophy' className='fa fa-fw' />}
      </div>
      <div className='bottom-left-cell'>
        {addExtraMedia(choice)}
      </div>
    </div>
  )
}

export default ChoiceCard