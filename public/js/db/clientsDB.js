class ClientsDB{
    // Returns Client object from clients/{clientId}.
    static async getClient(clientId) {
        let result 
        await db.collection('clients').doc(clientId).get()
            .then(doc => {
                result = doc
            }).catch(error => {
                Notification.display(2, "Error Getting Client!")
            })

        let client = new Client()

        client.docToClient(result)

        return client
    }

    // Returns array of Client objects from all docs in clients.
    static async getActiveClients() {
        let clients = new Array()
        let result = await db.collection('clients')
            .where('active' ,'==', true)
            .get()
            .catch(error => {
                Notification.display(2, "Error Getting Deactive Client!")
            })

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
            .then(docs => {
                result = docs
            }).catch(error => {
                Notification.display(2, "Error Getting Deactive Client!")
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
            Notification.display(1, "Client Added")
        }).catch(error => {
            Notification.display(2, "Error Adding Client")
        })
    }

    // Updates existing client doc at clients/{clientId}.
    static async updateClient(clientId, name, dob, mobile, address1, address2, town, county, eircode, marital, active) {
        let client = new Client(clientId, name, dob, mobile, address1, address2, town, county, eircode, marital, active)

        db.collection("clients").doc(clientId).set(client.toFirestore())
            .then(() => {
                Notification.display(1, "Client Updated")
            }).catch(error => {
                Notification.display(2, "Error Updating Client")
            })
    }

    // Deletes doc at clients/{clientId}.
    static async deleteClient(clientId) {
        db.collection('clients').doc(clientId).delete()
            .then(() => {
                Notification.display(1, "Client deleted")
            }).catch(error => {
                console.log(error.message())
                Notification.display(2, "Unable to delete client")
            })
    }

    // Sets clients/{clientId}/active field to false. 
    static async deactivateClient (clientId) {
        await db.collection('clients').doc(clientId).update({
            "active": false
        }).then(() => {
            Notification.display(1, "Client deactivated")
        }).catch(error => {
            console.log(error.message())
            Notification.display(2, "Unable to de-activate client")
        })
    }

    // Sets clients/{clientId}/active field to true.
    static async activateClient (clientId) {
        db.collection('clients').doc(clientId).update({
            "active": true
        }).then(() => {
            Notification.display(1, "Client Activated")
        }).catch(error => {
            Notification.display(2, "Error Activating Client")
        })
    }
}











