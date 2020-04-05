$(document).ready(function() {
    Index.load()
})

class Index{
    static load(){
            this.listeners()
    }

    static signIn(){
        var email = $("#signin-email").val()
        var password = $("#signin-password").val()

        Auth.signIn(email, password)
            .then((ref) => {
                UsersDB.getUser(ref.user.uid)
                    .then(user => {
                        if(user.archived == true) Notification.formError("Your account is not active!") 
                        else document.location.href = "dashboard.html"
                    })
            }).catch(error => {
            if(error.message.includes("no user record")){
                $('.form-error').text("Email not found!")
                console.log("Email not found!")
            }
            if(error.message.includes("password is invalid")){
                $('.form-error').text("Invalid password!")                                
                console.log("Invalid password!")
            }
        })
    }

    static signUp(){
        let email = $("#signup-email").val()
        let password1 = $("#signup-password1").val()
        let password2 = $("#signup-password2").val()
        let name = $("#signup-name").val()
        let mobile = $("#signup-mobile").val()
        let role = $("#signup-role").val()

        if(email == ""){
            Notification.formError("Please enter an email!")
        }else if(!Validate.email(email)){
            Notification.formError("Email format invalid!")
        }

        else if(password1 == "" || password2 == ""){
            Notification.formError("Please enter a password!")
        }else if(password1.length < 6){
            Notification.formError("Password must be longer than 6 characters!")
        }else if(password1 != password2){
            Notification.formError("Passwords do not match!")
        }

        else if(name == ""){
            Notification.formError("Please enter a name!")
        }

        else if(mobile == ""){
            Notification.formError("Please enter a mobile!")
        }else if(!Validate.mobile(mobile)){
            Notification.formError("Invalid mobile format!")
        }

        else if(role == null){
            Notification.formError("Please select a role!")
        }

        else{
            Notification.formError("")

            Auth.signUp(email, password1, name, mobile, role)
                .then(() => {
                    this.toggleForm()
                    Notification.display(1, "Your account is awaiting approval")
                }).catch(error => {
                if(error.message.includes("no user record")){
                    $('.form-error').text("Email not found!")
                    console.log("Email not found!")
                }
                if(error.message.includes("password is invalid")){
                    $('.form-error').text("Invalid password!")                                
                    console.log("Invalid password!")
                }
            })
        }  
    }
    
    static toggleForm(){
        $('#signup').toggleClass("d-none")
        $('#signin').toggleClass("d-none")
    }

    static async listeners(){
        $('#form-signin').submit(function(event){
            event.preventDefault()
            Index.signIn()
        })

        $('#form-signup').submit(function(event){
            event.preventDefault()
            Index.signUp()
        })

        $('#btn-toggle-signup').click(function(){
            Index.toggleForm()
        })
    }
}

