// Check out js modules
var currentUser = null
var signedIn = false

//var currentUser = null
// Listen for auth state change.
auth.onAuthStateChanged(user => {
    if(user){
        //signedIn = true
                //console.log(signedIn)

    } else{
        //signedIn = false
                //console.log(signedIn)
    }   
})

// Sign in.
function signIn(){
    var email = $("#signin-email").val()
    var password = $("#signin-password").val()
    
    if(email != "" || password != ""){
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            router("dashboard")
            console.log("hello")
            signedIn = true
        }).catch(error => {
            $("#signin-error").html(error.message)
        })
    }

    return false
}

// Sign Up.
function signUp(){
    var name = $("#signup-name").val()
    var email = $("#signup-email").val()
    var password = $("#signup-password").val()
    console.log("hsdkjfh")
    // Validation.
    if(name != "" || email != "" || password != ""){
        auth.createUserWithEmailAndPassword(email, password).then(data => { 
            db.collection('users').doc(data.user.uid).set({
                name: name
                }).then(() => {
                    router("dashboard")
                })
        }).catch(error => {
            console.log(error.message)
            $("#signup-error").html(error.message)
        })
    }

    return false 
}

// Sign out. 
const signOut = document.querySelector('#sign-out')
signOut && signOut.addEventListener('click', (e) => {
    auth.signOut()
    signedOut = false
    router("signin")
})

function setupSelectors(){
    console.log("Selectors setup")
    signinForm = document.querySelector('#form-signin') 
    signupForm = document.querySelector('#form-signup')
}

document.onload = function(){
    if(signedIn){
    console.log("Signed in: " + signedIn)
    //router("dashboard")
    console.log("Signed in: Routing to dashboard")
    }else{
    console.log("Signed in = " + signedIn + " routing to signin")
    router("signin")
    }
}
