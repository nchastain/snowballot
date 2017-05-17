import moment from 'moment'
import { createFilter } from 'react-search-input'
import uuid from 'uuid'

export const doesExpire = function (expires) {
  if (typeof expires !== 'string') return false
  return moment(new Date(expires)).isBefore(moment(Date.now()))
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

export const getVoteSum = function (choices) {
  let voteTotal = 0
  choices.forEach(function (choice) { voteTotal += choice.votes })
  return voteTotal
}

export const getSearchResults = function (term, sbs) {
  const KEYS_TO_FILTERS = ['title']
  const filteredSbs = term !== ''
    ? sbs.filter(createFilter(term, KEYS_TO_FILTERS))
    : sbs
  return filteredSbs.sort((a, b) => {
    return b.createdAt - a.createdAt
  })
}

export const initialState = {
  optionsExpanded: false,
  title: '',
  alias: '',
  choicesExpanded: {},
  description: '',
  doesExpire: false,
  isPrivate: false,
  isExtensible: false,
  choices: [
    {title: '', votes: 0, id: 1, info: ''},
    {title: '', votes: 0, id: 2, info: ''}
  ],
  tags: [],
  suggestions: []
}

export const validateSb = function (sbOptions) {
  const { title, alias, isPrivate, choices, isExtensible, expires, tags, description, mainImage, hasMainImage } = sbOptions
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
  const options = {
    title: title,
    alias: realAlias,
    privateAlias: privateURL,
    isPrivate: isPrivate,
    expires: expires || null,
    isExtensible: isExtensible || false,
    tags: tags || [],
    description: description || '',
    mainImage: mainImage || '',
    hasMainImage: hasMainImage || false
  }
  return {options, filteredChoices}
}

export const getChoiceNumber = e => parseInt(e.target.id.match(/\d+$/).join(''))
