// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDvWIKyHILbBQUcVKf3gLjV84fIUgCIr3w",
    authDomain: "carers-app.firebaseapp.com",
    databaseURL: "https://carers-app.firebaseio.com",
    projectId: "carers-app",
    storageBucket: "carers-app.appspot.com",
    messagingSenderId: "128407070115",
    appId: "1:128407070115:web:3903fd81347b8c4cc76616"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initializes Auth and Firestore
const auth = firebase.auth()
const db = firebase.firestore()

