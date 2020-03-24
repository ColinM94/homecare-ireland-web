$('#form-signin').submit(function(event){
    event.preventDefault()

    var email = $("#signin-email").val()
    var password = $("#signin-password").val()

    Auth.signIn(email, password)
        .then(user => {
            UsersDB.getUser(user.uid).then(userData => {
                if(userData.archived == false){
                    $(".form-error").text("")
                    window.location.href = "dashboard.html"
                }else{
                    $(".form-error").text("Unable to sign in, user is deactive!")
                }
            })
        }).catch(error => {
            if(error.message.includes("no user record"))
                $('.form-error').text("Email not found!")
            if(error.message.includes("password is invalid"))
                $('.form-error').text("Invalid password!")
        })
})