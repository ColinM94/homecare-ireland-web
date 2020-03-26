class UsersDB{    
    listen(callback, id, type){
        let query = db.collection('users')
        
        query.onSnapshot(querySnapshot => {
                let users = new Array()

                querySnapshot.forEach(doc => {
                    let user = new UserModel()
                    user.docToUser(doc)
                    users.push(user)

                    // Users.refreshTable(users)
                })
            }, err => {
                console.log(`Encountered error: ${err}`);
        })
    }

    // Listens for changes and calls callback function. 
    listenUsers(callback, id, ref){
        let doc = db.collection('users').doc(id)
        let observer = doc.onSnapshot(docSnapshot => {
            let user = new UserModel()
            user.docToUser(docSnapshot)
            callback(user, ref)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    // Listens for changes and calls callback function. 
    listenUser(callback, id, ref){
        let doc = db.collection('users').doc(id)
        let observer = doc.onSnapshot(docSnapshot => {
            let user = new UserModel()
            user.docToUser(docSnapshot)
            callback(user, ref)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    // Returns User object from users/{userId}. 
    static async getUser(userId) {
        let doc = await db.collection('users').doc(userId).get()

        let user = new UserModel()

        user.docToUser(doc)

        return user
    }

    // Returns array of User objects from users. 
    static async getUsers() {
        let users = new Array()

        let result = await db.collection('users').get()

        result.forEach(doc => {
            let user = new UserModel()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Returns array of User objects from users. 
    static async getActiveUsers() {
        let users = new Array()

        let result = await db.collection('users')
            .where('active' ,'==', true)
            .get()

        result.forEach(doc => {
            let user = new UserModel()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    static async getActiveCarers(){
        let users = new Array()

        let result = await db.collection('users')
            .where('active' ,'==', true)
            .where('role', '==', 'Carer')
            .get()

        result.forEach(doc => {
            let user = new UserModel()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    static async getAdmins(){
        let users = new Array()

        let result = await db.collection('users')
            .where('active' ,'==', true)
            .where('role', '==', 'Admin')
            .get()

        result.forEach(doc => {
            let user = new UserModel()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Returns array of User objects from all docs in users.   
    static async getDeactiveUsers() {
        let users = new Array()

        let result = await db.collection('users').where('active' ,'==', false).get()

        result.forEach(doc => {
            let user = new UserModel()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Adds a new doc to users. 
    static async addUser(id, role, name, address1, address2, town, county, eircode, active) {
        let user = new UserModel(id, role, name, address1, address2, town, county, eircode, active)
        await db.collection("users").add(user.toFirestore())
    }

    // Deletes doc at users/{userId}.
    static async deleteUser(userId) {
        db.collection('users').doc(userId).delete()
    }

    // Sets users/{userId}/arhived field to true. 
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
}
