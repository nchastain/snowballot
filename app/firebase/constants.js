import firebase from 'firebase'

try {
  const config = {
    apiKey: 'AIzaSyAHjeL0K9HzKAswXoTnqNOCGxV-D-Di2fU',
    authDomain: 'snowballot-2e903.firebaseapp.com',
    databaseURL: 'https://snowballot-2e903.firebaseio.com',
    storageBucket: 'snowballot-2e903.appspot.com',
    messagingSenderId: '48491209280'
  }

  firebase.initializeApp(config)
} catch (e) {
  console.log('Error initializing firebase application.')
}

export const firebaseRef = firebase.database().ref()
export const firebaseAuth = firebase.auth
export default firebase
