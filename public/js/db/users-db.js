class UsersDB{    
    // Returns User object from users/{userId}. 
    static async getUser(userId) {
        let doc = await db.collection('users').doc(userId).get()

        let user = new UserModel()

        user.docToUser(doc)

        return user
    }

    // Returns array of User objects from users. 
    static async getUsers(arg, type) {
        let users = new Array()

        let ref = db.collection('users')

        if(type == "carer")    
            ref = ref.where("role", "==", "carer")
        else if(type == "admin")
            ref = ref.where("role", "==", "admin")
        else if(type == "doctor")
            ref = ref.where("role", "==", "doctor")
  
        if(arg == "active")
            ref = ref.where("archived", "==", false)
        else if(arg == "inactive")
            ref = ref.where("archived", "==", true)

        let result = await ref.get()

        result.forEach(doc => {
            let user = new UserModel()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Adds a new doc to users. 
    static async addUser(id, role, name, gender, dob, address1, address2, town, county, mobile, eircode) {
        let user = new UserModel(id, role, name, gender, dob, address1, address2, town, county, mobile, eircode, true, [])
        await db.collection("users").doc(id).set(user.toFirestore())
    }

    // Deletes doc at users/{userId}.
    static async deleteUser(userId) {
        db.collection('users').doc(userId).delete()
    }

    // Sets users/{userId}/archived field to true. 
    static async archive(userId) {
        await db.collection('users').doc(userId).update({
            "archived": true
        })
    }

    // Sets users/{userId}/arhived field to false. 
    static async unArchive (userId) {
        await db.collection('users').doc(userId).update({
            "archived": true
        })
    }

    // Sets users/{userId}/active field to false. 
    static async deactivateUser (userId) {
        await db.collection('users').doc(userId).update({
            "active": false
        })
    }

    // Sets users/{userId}/active field to true. 
    static async activateUser (userId) {
        await db.collection('users').doc(userId).update({
            "active": true
        })
    }

    // Adds {clientId} to users/{usersId}/clients array. 
    static async addConn(userId, clientId){
        let user = await this.getUser(userId)

        let clients = user.clients

        if(!clients.includes(clientId))
            clients.push(clientId)

        await db.collection('users').doc(userId).update({
            clients: clients
        })
    }

    // Remove {clientId} from users/{userId}/clients array. 
    static async deleteConn(userId, clientId){
        let user = await this.getUser(userId)

        let clients = user.clients

        let index = clients.indexOf(clientId)
        clients.splice(index)

        await db.collection('users').doc(userId).update({
            clients: clients
        })
    }
}
