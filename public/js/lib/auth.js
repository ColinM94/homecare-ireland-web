class Auth{
    static async signIn(email, password){
        if(email == "" || password == "") return false 

        return await auth.signInWithEmailAndPassword(email, password)
    }

    static async signUp(email, password, name, mobile, role){
        auth.createUserWithEmailAndPassword(email, password)
            .then((ref) => {
                UsersDB.addUser(ref.user.uid, role, name, "", "", "", "", "", "", mobile, "")
                console.log(ref.user.uid)
            })
            .catch(function(error) {
                console.log(error.code)
                console.log(error.message)
            })
    }

    static signOut(){
        auth.signOut()
    }
}