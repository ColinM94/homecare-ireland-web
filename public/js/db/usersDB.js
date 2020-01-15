class UsersDB{
    // Returns array of User objects from users. 
    static async getUsers() {
        let users = new Array()

        let result = await db.collection('users').where('active' ,'==', true).get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Returns User object from users/{userId}. 
    static async getUser(userId) {
        let doc = await db.collection('users').doc(userId).get()
            .catch(error => {
                Message.display(2, "Error Getting User")
            })

        let user = new User()

        user.docToUser(doc)

        return user
    }

    // Returns array of User objects from all docs in users.   
    static async getUsersDeactive() {
        let users = new Array()

        let result = await db.collection('users').where('active' ,'==', false).get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Adds a new doc to users. 
    static async addUser(id, role, name, address1, address2, town, county, eircode, active) {
        let user = new User(id, role, name, address1, address2, town, county, eircode, active)
        await db.collection("users").add(user.toFirestore()).then(() => {
            return true
        }).catch(error => {
            Message.display(2, "Unable to Add User")

            return false
        })
    }

    // Sets users/{userId}/active field to false. 
    static async deactivateUser (userId) {
        await db.collection('users').doc(userId).update({
            "active": false
        }).then(() => {
            Message.display(1, "User De-activated!")
        }).catch(error => {
            console.log(error.message)
            Message.display(2, "Unable to De-activating User")
        })
    }

    // Sets users/{userId}/active field to true. 
    static async activateUser (userId) {
        db.collection('users').doc(userId).update({
            "active": true
        }).then(() => {
            Message.display(1, "User Activated")
        }).catch(error => {
            Message.display(2, "Unable to Activate User")
        })
    }
}
