// Returns array of users from DB.
async function getUsers() {
    let users = new Array()

    let result = await db.collection('users').where('active' ,'==', true).get()

    result.forEach(doc => {
        let user = new User()   
        user.docToUser(doc)
        users.push(user)
    })

    return users
}

// Returns user from DB. 
async function getUser(userId) {
    let doc = await db.collection('users').doc(userId).get()

    let user = new User()

    user.docToUser(doc)

    return user
}

async function addUser(id, role, name, address1, address2, town, county, eircode, active) {
    let user = new User(id, role, name, address1, address2, town, county, eircode, active)
    await db.collection("users").add(user.toFirestore()).then(() => {
        return true
    }).catch(error => {
        return false
    })
}

// Returns array of users from DB.  
async function getUsersDeactive() {
    let users = new Array()

    let result = await db.collection('users').where('active' ,'==', false).get()

    result.forEach(doc => {
        let user = new User()   
        user.docToUser(doc)
        users.push(user)
    })

    return users
}


// Deactivates user account. 
async function deactivateUser (userId) {
    let result 
    
    await db.collection('users').doc(userId).update({
        "active": false
    }).then(() => {
        result = true
    }).catch(error => {
        console.log(error.message)
        result = false
    })

    return result
}

// Activates user account. 
async function activateUser (userId) {
    db.collection('users').doc(userId).update({
        "active": true
    }).then(() => {
        return true
    }).catch(error => {
        return false
    })
}

// Returns array of client ids.  
async function getUserConnections(id) {
    let doc = await db.collection('connections').doc(id).get()
    return doc.data().clients
}

class User {
    constructor(id, role, name, address1, address2, town, county, mobile, eircode, active) {
        this.id = id
        this.role = role
        this.name = name
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
        this.mobile = mobile
        this.active = active
    }

    // Instantiates class with values from firestore document. 
    docToUser(doc) {
        this.id = doc.id
        this.role = doc.data().role
        this.name = doc.data().name
        this.address1 = doc.data().address1
        this.address2 = doc.data().address2
        this.town = doc.data().town
        this.county = doc.data().county
        this.eircode = doc.data().eircode
        this.mobile = doc.data().mobile
        this.active = doc.data().active
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let user = {
            id : this.id,
            role : this.role,
            name : this.name,
            address1 : this.address1,
            address2 : this.address2,
            town : this.town,
            county : this.county,
            eircode : this.eircode,
            mobile : this.mobile,
            active: this.active
        }

        return user
    }
}