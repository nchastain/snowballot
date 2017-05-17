import moment from 'moment'
import { createFilter } from 'react-search-input'

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
