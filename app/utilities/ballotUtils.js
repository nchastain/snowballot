import moment from 'moment'
import { createFilter } from 'react-search-input'
import uuid from 'uuid'

export const cardBackgrounds = ['#54D19F', '#5192E8', '#DE80FF', '#E83442', '#FFAC59', 'coral', '#F19BA1']

export const lightCardBackgrounds = ['#87FFD2', '#84C5FF', '#FFD1FF', '#FF6775', '#FFDF8C', '#FFB283', '#FFCED4']

export const didExpire = function (expires) {
  if (typeof expires !== 'string') return false
  return moment(expires).isBefore(moment().format('MM/DD/YYYY'))
}

export const isCreator = function (user, creator) {
  return user === creator
}

export const previewImage = function (file, query) {
  let img = document.querySelector(query)
  let reader = new FileReader()
  reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result } })(img)
  reader.readAsDataURL(file)
}

export const findLeader = function (choices) {
  let most = 0
  let leader = null
  choices.forEach(function (choice) {
    if (choice.votes > most) {
      most = choice.votes
      leader = choice
    }
  })
  return leader
}

export const isLeader = function (choice, expiration, choices) {
  return didExpire(expiration) && getVoteSum(choices) > 0 && choice.id === findLeader(choices).id
}

export const getVoteSum = choices => choices.reduce((prev, next) => prev + next.votes, 0)

export const popularityFilter = sb => getVoteSum(sb.choices) + sb.favorites

export const getSearchResults = function (term, sbs) {
  const KEYS_TO_FILTERS = ['title']
  const filteredSbs = term !== ''
    ? sbs.filter(createFilter(term, KEYS_TO_FILTERS))
    : sbs
  return filteredSbs.sort((a, b) => {
    return b.createdAt - a.createdAt
  })
}

export const filterChoices = function (term, choices) {
  const KEYS_TO_FILTERS = ['title']
  const filteredChoices = term !== ''
    ? choices.filter(createFilter(term, KEYS_TO_FILTERS))
    : choices
  return filteredChoices
}

export const initialState = {
  optionsExpanded: false,
  title: '',
  alias: '',
  choicesExpanded: {},
  description: '',
  didExpire: false,
  isPrivate: false,
  isExtensible: false,
  choices: [
    {title: '', votes: 0, id: 1, info: '', added: 1495860030876},
    {title: '', votes: 0, id: 2, info: '', added: 1495860030877}
  ],
  tags: [],
  suggestions: [],
  favorites: 0
}
const randomizedColor = (choices) => choices.length % cardBackgrounds.length

export const validateSb = function (sbOptions) {
  const { title, alias, isPrivate, choices, isExtensible, expires, description, tags } = sbOptions
  if (title.length === 0) throw new Error('Snowballots must have a title.')
  const privateURL = uuid.v4().replace(/-/g, '').substring(0, 10)
  const publicURL = alias.length > 0 ? alias : title.replace(/\s+/g, '').substring(0, 10)
  const realAlias = isPrivate ? privateURL : publicURL
  const dupesObj = {}
  const filteredChoices = choices.filter(function (choice) {
    let duplicate = false
    dupesObj[choice.title.toLowerCase()] ? duplicate = true : dupesObj[choice.title.toLowerCase()] = choice
    return choice.title.length > 0 && !duplicate
  })
  if (filteredChoices.length < 2 && !isExtensible) {
    throw new Error('Snowballots that cannot by extended by other users must be created with at least 2 choices.')
  }
  let randomColor = randomizedColor(choices)
  let color = cardBackgrounds[randomColor]
  let lightColor = lightCardBackgrounds[randomColor]
  const options = {
    title: title,
    alias: realAlias,
    privateAlias: privateURL,
    isPrivate: isPrivate,
    expires: expires || null,
    isExtensible: isExtensible || false,
    tags: tags || null,
    description: description || '',
    favorites: 0,
    color: color,
    lightColor: lightColor
  }
  return {options, filteredChoices}
}

export const getChoiceNumber = e => parseInt(e.target.id.match(/\d+$/).join(''))

export const hasExtraMedia = choice => choice.photo || choice.info || choice.link || choice.youtube

export const favoritedSb = function (sbId, favorites) {
  if (!favorites) return false
  if (Object.keys(favorites).indexOf(sbId) !== -1) {
    Object.keys(favorites).forEach(function (sb) {
      if (sb === sbId) return favorites[sb]
    })
  } else return false
}
