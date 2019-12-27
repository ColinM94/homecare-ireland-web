// Sign in.
function signIn(){
    var email = $("#signin-email").val()
    var password = $("#signin-password").val()
    
    if(email != "" || password != ""){
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            window.location = "dashboard.html"
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

function signOut(){
    auth.signOut()
}



