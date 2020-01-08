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
        let doc = await db.collection('clients').doc(clientId).get()

        let client = new Client()

        client.docToClient(doc)

        return client
    }

    // Returns array of Clients objects from clients where active = true. 
    static async getClientsDeactive() {
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
    static async addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, active) {  
        let client = new Client(null, name, dob, mobile, address1, address2, town, county, eircode, marital, active)
        await db.collection("clients").add(client.toFirestore()).then(function(ref){
            let connections = {
                ids : []
            }

            db.collection('connections').doc(ref.id).set(connections)
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
            return true
        }).catch(error => {
            return false
        })
    }

    // Sets clients/{clientId}/active field to true.
    static async activateClient (clientId) {
        db.collection('clients').doc(clientId).update({
            "active": true
        })
    }
}








