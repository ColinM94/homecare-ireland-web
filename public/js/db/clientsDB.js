class ClientsDB{
    // Returns array of Client objects from all docs in clients.
    static async getClients() {
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
    static async getClient(clientId) {
        let result 
        await db.collection('clients').doc(clientId).get()
            .then(doc => {
                result = doc
            }).catch(error => {
                Message.display(2, "Error Getting Clients!")
            })

        let client = new Client()

        client.docToClient(result)

        return client
    }

    // Returns array of Clients objects from clients where active = true. 
    static async getClientsDeactive() {
        let clients = new Array()

        let result 

        await db.collection('clients').where('active' ,'==', false).get()
            .then(docs => {
                result = docs
            }).catch(error => {
                Message.display(2, "Error Getting Deactive Client!")
            })

        result.forEach(doc => {
            let client = new Client()   
            client.docToClient(doc)
            clients.push(client)
        })

        return clients
    }

    // Adds a new doc to clients. 
    static async addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, active) {  
        let client = new Client(null, name, dob, mobile, address1, address2, town, county, eircode, marital, active)
        await db.collection("clients").add(client.toFirestore()).then(function(ref){
            let connections = {
                ids : []
            }

            db.collection('connections').doc(ref.id).set(connections)
        }).then(() => {
            Message.display(1, "Client Added!")
        }).catch(error => {
            Message.display(2, "Error Adding Client!")
        })
    }

    // Updates existing client doc at clients/{clientId}.
    static async updateClient(clientId, name, dob, mobile, address1, address2, town, county, eircode, marital, active) {
        let client = new Client(clientId, name, dob, mobile, address1, address2, town, county, eircode, marital, active)

        db.collection("clients").doc(clientId).set(client.toFirestore())
    }

    // Deletes doc at clients/{clientId}.
    static async deleteClient(clientId) {
        await ConnsDB.deleteConns(clientId)

        await Promise.all([
            db.collection('clients').doc(clientId).delete(),
            db.collection('connections').doc(clientId).delete()
        ])
    }

    // Sets clients/{clientId}/active field to false. 
    static async deactivateClient (clientId) {
        await db.collection('clients').doc(clientId).update({
            "active": false
        }).then(() => {
            Message.display(1, "Client Deactivated!")
        }).catch(error => {
            Message.display(2, "Error De-activating Client!")
        })
    }

    // Sets clients/{clientId}/active field to true.
    static async activateClient (clientId) {
        db.collection('clients').doc(clientId).update({
            "active": true
        }).then(() => {
            Message.display(1, "Client Activated!")
        }).catch(error => {
            Message.display(2, "Error Activating Client!")
        })
    }
}








