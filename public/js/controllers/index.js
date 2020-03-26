$(document).ready(function() {
    Index.load()
})

class Index{
    static load(){
        $("#main-content").load("views/signin.html", () => {
            this.listeners()
        })
    }

    static async listeners(){
        $('#form-signin').submit(function(event){
            event.preventDefault()

            var email = $("#signin-email").val()
            var password = $("#signin-password").val()

            Auth.signIn(email, password)
                .then(result => {
                    Dashboard.load()
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
        })
    }
}

