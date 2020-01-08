// Returns array of Client objects from all docs in clients.
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

// Returns Client object from clients/{clientId}.
async function getClient(clientId) {
    let doc = await db.collection('clients').doc(clientId).get()

    let client = new Client()

    client.docToClient(doc)

    return client
}

// Returns array of Clients objects from clients where active = true. 
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

// Adds a new doc to clients. 
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

// Updates existing client doc at clients/{clientId}.
async function updateClient(clientId, name, dob, mobile, address1, address2, town, county, eircode, marital, active) {
    let client = new Client(clientId, name, dob, mobile, address1, address2, town, county, eircode, marital, active)

    db.collection("clients").doc(clientId).set(client.toFirestore())

    refreshTable()
}

// Deletes doc at clients/{clientId}.
async function deleteClient(clientId) {
    await deleteConnections(clientId)

    await Promise.all([
        db.collection('clients').doc(clientId).delete(),
        db.collection('connections').doc(clientId).delete()
    ])
}

// Sets clients/{clientId}/active field to false. 
async function deactivateClient (clientId) {
    await db.collection('clients').doc(clientId).update({
        "active": false
    }).then(() => {
        return true
    }).catch(error => {
        return false
    })
}

// Sets clients/{clientId}/active field to true.
async function activateClient (clientId) {
    db.collection('clients').doc(clientId).update({
        "active": true
    })
}

