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
const functions = firebase.functions()

// Sign in.
function signIn(){
    // Sets signin error to blank on submit. 
    $("#signin-error").html("")

    var email = $("#signin-email").val()
    var password = $("#signin-password").val()
    
    if(email != "" || password != ""){
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            UsersDB.getUser(cred.user.uid).then(user => {
                console.log(user)
                if(user.active == true){
                    window.location = "dashboard.html"
                    signedIn = true
                }else{
                    $("#signin-error").html("User deactivated by Administrator")
                }
            })
        }).catch(error => {
            $("#signin-error").html(error.message)
        })
    }
        
    return false
}

function signOut(){
    auth.signOut()
}
