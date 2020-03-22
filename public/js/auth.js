class Auth{
    static signIn(){
        var email = $("#signin-email").val()
        var password = $("#signin-password").val()

        if(email == "" || password == "") return false 

        auth.signInWithEmailAndPassword(email, password).then(cred => {
            UsersDB.getUser(cred.user.uid).then(user => {
                if(user.active == true){
                    window.location.href = "dashboard.html"
                }
            })
        }).catch(error => {
            console.log(error.message)
        })
        
        return false
    }

    static async signOut(){
        if(await Prompt.confirm("Are you sure you want to sign out?")){
            auth.signOut()
            window.location.href = "index.html"
        }
    }
}