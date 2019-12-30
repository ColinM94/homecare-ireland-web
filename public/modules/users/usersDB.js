// Returns array of users from DB.
async function getUsers() {
    let users = new Array()

    let result = await db.collection('users').get()
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

class User {
    constructor(id, role, name, address1, address2, town, county, eircode) {
        this.id = id
        this.role = role
        this.name = name
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
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
            eircode : this.eircode
        }

        return user
    }
}