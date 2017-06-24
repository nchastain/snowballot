import moment from 'moment'
import { createFilter } from 'react-search-input'
import uuid from 'uuid'
import { imagesRef } from '../firebase/constants'

export const didExpire = function (expires) {
  if (typeof expires !== 'string') return false
  // console.log(moment(expires).isBefore(moment().format('MM/DD/YYYY')))
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

export const getVoteSum = choices => choices.reduce((prev, next) => prev + next.votes, 0)

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
  didExpire: false,
  isPrivate: false,
  isExtensible: false,
  choices: [
    {title: '', votes: 0, id: 1, info: '', added: 1495860030876},
    {title: '', votes: 0, id: 2, info: '', added: 1495860030877}
  ],
  tags: [],
  suggestions: [],
  favorites: 0,
}

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
  const options = {
    title: title,
    alias: realAlias,
    privateAlias: privateURL,
    isPrivate: isPrivate,
    expires: expires || null,
    isExtensible: isExtensible || false,
    tags: tags || null,
    description: description || '',
    favorites: 0
  }
  return {options, filteredChoices}
}

export const getChoiceNumber = e => parseInt(e.target.id.match(/\d+$/).join(''))

export const favoritedSb = function (sbId, favorites) {
  if (!favorites) return false
  if (Object.keys(favorites).indexOf(sbId) !== -1) {
    Object.keys(favorites).forEach(function (sb) {
      if (sb === sbId) return favorites[sb]
    })
  } else return false
}

export const updateImage = (alias, selector) => {
  let imageUrl = imagesRef.child(`${alias}/${selector}`)
  imageUrl.getDownloadURL().then(function (url) {
    const imageHolder = document.querySelector(`#image-holder-${selector}`)
    imageHolder.src = imageHolder === null ? 'http://placehold.it/200x200' : url
  }).catch(function (error) {
    switch (error.code) {
      case 'storage/object_not_found':
        break
      case 'storage/unauthorized':
        break
      case 'storage/canceled':
        break
      case 'storage/unknown':
        break
    }
  })
}
