class Auth{
    static async signIn(email, password){
        if(email == "" || password == "") return false 

        let result = await auth.signInWithEmailAndPassword(email, password)

        return result.user
    }

    static async signOut(){
        if(await Prompt.confirm("Are you sure you want to sign out?")){
            auth.signOut()
            window.location.href = "index.html"
        }
    }
}