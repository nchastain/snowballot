import firebase from 'firebase'
import {firebaseRef, firebaseAuth} from './constants.js'
import * as actions from '.././actions'

export function auth (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return firebaseAuth().signOut().then(function () {}).catch(function (err) {})
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw).catch(function (error) {})
}

export function fbLogin () {
  let provider = new firebase.auth.FacebookAuthProvider()
  return firebaseAuth().signInWithPopup(provider).then(function (result) {
    let token = result.credential.accessToken
    let user = result.user
  }).catch(function (error) {
    let errorCode = error.code
    let errorMessage = error.message
    let email = error.email
    var credential = error.credential
  })
}

export function googleLogin () {
  var provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken
    var user = result.user
  }).catch(function (error) {
    var errorCode = error.code
    var errorMessage = error.message
    var email = error.email
    var credential = error.credential
  });
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return firebaseRef.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}

