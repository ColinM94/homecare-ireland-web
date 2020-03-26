class Auth{
    static async signIn(email, password){
        if(email == "" || password == "") return false 

        return await auth.signInWithEmailAndPassword(email, password)
    }

    static signOut(){
        auth.signOut()
    }
}