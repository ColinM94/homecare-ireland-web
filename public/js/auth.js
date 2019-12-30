// Sign in.
function signIn(){
    // Sets signin error to blank on submit. 
    $("#signin-error").html("")

    var email = $("#signin-email").val()
    var password = $("#signin-password").val()
    
    if(email != "" || password != ""){
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            getUser(cred.user.uid).then(user => {
                console.log(user)
                log(user.active)
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

// Sign Up.
function signUp(){
    $("#signup-error").html("")

    var name = $("#signup-name").val()
    var email = $("#signup-email").val()
    var password = $("#signup-password").val()
    //var address1 = $("#signup-address1").val()
    //var address2 = $("#signup-address2").val()
    //var county = $("#signup-county").val()
    //var eircode = $("#signup-eircode").val()

    // Validation.
    if(name != "" || email != "" || password != ""){
        auth.createUserWithEmailAndPassword(email, password).then(data => { 
            if(addNewUser(data.user.uid, name) == true){
                window.location = "dashboard.html"
            }else {
                $("#signup-error").html("Error creating user")
            }
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



