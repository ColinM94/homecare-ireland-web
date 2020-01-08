// Returns array of User objects from users. 
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

// Returns User object from users/{userId}. 
async function getUser(userId) {
    let doc = await db.collection('users').doc(userId).get()

    let user = new User()

    user.docToUser(doc)

    return user
}

// Returns array of User objects from all docs in users.   
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

// Adds a new doc to users. 
async function addUser(id, role, name, address1, address2, town, county, eircode, active) {
    let user = new User(id, role, name, address1, address2, town, county, eircode, active)
    await db.collection("users").add(user.toFirestore()).then(() => {
        return true
    }).catch(error => {
        return false
    })
}

// Sets users/{userId}/active field to false. 
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

// Sets users/{userId}/active field to true. 
async function activateUser (userId) {
    db.collection('users').doc(userId).update({
        "active": true
    }).then(() => {
        return true
    }).catch(error => {
        return false
    })
}

