// Adds a new client to DB.  
async function addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, active) {  
    let client = new Client(null, name, dob, mobile, address1, address2, town, county, eircode, marital, active)
    await db.collection("clients").add(client.toFirestore()).then(function(ref){
        let connections = {
            ids : []
        }

        db.collection('connections').doc(ref.id).set(connections)
    })
    refreshTable()
}

// Updates existing client details in DB.
async function updateClient(id, name, dob, mobile, address1, address2, town, county, eircode, marital, active) {
    let client = new Client(id, name, dob, mobile, address1, address2, town, county, eircode, marital, active)

    db.collection("clients").doc(id).set(client.toFirestore())

    refreshTable()
}

// Returns array of clients from DB.  
async function getClients() {
    let clients = new Array()

    let result = await db.collection('clients').where('active' ,'==', true).get()

    result.forEach(doc => {
        let client = new Client()   
        client.docToClient(doc)
        clients.push(client)
    })

    return clients
}

// Returns client from DB. 
async function getClient(clientId) {
    let doc = await db.collection('clients').doc(clientId).get()

    let client = new Client()

    client.docToClient(doc)

    return client
}

// Deactivates client account. 
async function deactivateClient (clientId) {
    await db.collection('clients').doc(clientId).update({
        "active": false
    }).then(() => {
        return true
    }).catch(error => {
        return false
    })
}

// Activates client account. 
async function activateClient (clientId) {
    db.collection('clients').doc(clientId).update({
        "active": true
    })
}

// Returns array of clients from DB.  
async function getClientsDeactive() {
    let clients = new Array()

    let result = await db.collection('clients').where('active' ,'==', false).get()

    result.forEach(doc => {
        let client = new Client()   
        client.docToClient(doc)
        clients.push(client)
    })

    return clients
}

class Client {
    constructor(id, name, dob, mobile, address1, address2, town, county, eircode, marital, active){
        this.id = id
        this.name = name
        this.dob = dob
        this.mobile = mobile
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
        this.marital = marital
        this.active = active
    }

    // Instantiates class with values from firestore document. 
    docToClient(doc) {
        this.id = doc.id
        this.name = doc.data().name
        this.dob = doc.data().dob
        this.mobile = doc.data().mobile
        this.address1 = doc.data().address1
        this.address2 = doc.data().address2
        this.town = doc.data().town
        this.county = doc.data().county
        this.eircode = doc.data().eircode
        this.marital = doc.data().marital
        this.active = doc.data().active
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let client = {
            id : this.id,
            name : this.name,
            dob : this.dob,
            mobile : this.mobile,
            address1 : this.address1,
            address2 : this.address2 ,
            town : this.town,
            county : this.county,
            eircode : this.eircode,
            marital : this.marital,
            active : this.active
        }

        return client
    }
}