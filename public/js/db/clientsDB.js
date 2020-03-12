class ClientsDB{
    // Returns Client object from clients/{clientId}.
    static async getClient(clientId) {
        let doc = await db.collection('clients').doc(clientId).get()
        let client = new Client()
        client.docToClient(doc)
        return client
    }
    
    // Returns array of Client objects from all docs in clients.
    static async getClients() {
        let clients = new Array()
        let result = await db.collection('clients').get()

        result.forEach(doc => {
            let client = new Client()   
            client.docToClient(doc)
            clients.push(client)
        })

        return clients
    }

    // Returns array of Client objects from all docs in clients.
    static async getActiveClients() {
        let clients = new Array()
        let result = await db.collection('clients').where('active' ,'==', true).get()

        result.forEach(doc => {
            let client = new Client()   
            client.docToClient(doc)
            clients.push(client)
        })

        return clients
    }

    // Returns array of Clients objects from clients where active = true. 
    static async getDeactiveClients() {
        let clients = new Array()

        let result 
        await db.collection('clients').where('active' ,'==', false).get()

        result.forEach(doc => {
            let client = new Client()   
            client.docToClient(doc)
            clients.push(client)
        })

        return clients
    }

    // Adds a new doc to clients. 
    static async addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active) {  
        let client = new Client(null, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active)

        db.collection("clients").add(client.toFirestore())
            // .then(function(ref){
            //     let connections = {
            //         ids : []
            //     }

            //     db.collection('connections').doc(ref.id).set(connections)
            // })
    }

    // Updates existing client doc at clients/{clientId}.
    static async updateClient(clientId, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active) {
        let client = new Client(clientId, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active)

        db.collection("clients").doc(clientId).set(client.toFirestore())
    }

    // Deletes doc at clients/{clientId}.
    static async deleteClient(clientId) {
        db.collection('clients').doc(clientId).delete()
    }

    // Sets clients/{clientId}/active field to true.
    static async activateClient (clientId) {
        await db.collection('clients').doc(clientId).update({"active": true})
    }

    // Sets clients/{clientId}/active field to false. 
    static async deactivateClient (clientId) {
        await db.collection('clients').doc(clientId).update({"active": false})
    }
}











