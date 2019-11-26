// Listen for auth state change.
auth.onAuthStateChanged(user => {
    if(user){
        router("dashboard")
        getUserInfo(user)
    } else{
        router("signin")
        //signedIn = false
    }   
})

// Sign in.
function signIn(){
    var email = $("#signin-email").val()
    var password = $("#signin-password").val()
    
    if(email != "" || password != ""){
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            //router("dashboard")
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

    // Validation.
    if(name != "" || email != "" || password != ""){
        auth.createUserWithEmailAndPassword(email, password).then(data => { 
            db.collection('users').doc(data.user.uid).set({
                name: name
                }).then(() => {
                    //router("dashboard")
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
    FirebaseAuth.getInstance().signOut();
    router("signin")
})



