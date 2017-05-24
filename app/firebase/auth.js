import firebase from 'firebase'
import {firebaseRef, firebaseAuth} from './constants.js'
import * as actions from '.././actions'

export function auth (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return firebaseAuth().signOut().then(function () {
    // Sign-out successful.
  }).catch(function (err) {
    console.log('An error occurred while signing out: ' + err)
  })
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
  .catch(function (error) {
    console.log(error)
  })
}

export function fbLogin () {
  let provider = new firebase.auth.FacebookAuthProvider()
  return firebaseAuth().signInWithPopup(provider).then(function (result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    let token = result.credential.accessToken
    let user = result.user
  }).catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code
    let errorMessage = error.message
    // The email of the user's account used.
    let email = error.email
    // The firebase auth.AuthCredential type that was used.
    var credential = error.credential
    // ...
  })
}

export function googleLogin () {
  var provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken
    // The signed-in user info.
    var user = result.user
    // ...
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code
    var errorMessage = error.message
    // The email of the user's account used.
    var email = error.email
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential
    // ...
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

