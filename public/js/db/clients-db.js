class ClientsDB{
    // Returns Client object from clients/{clientId}.
    static async getClient(clientId) {
        let doc = await db.collection('clients').doc(clientId).get()
        let client = new ClientModel()
        client.docToClient(doc)
        return client
    }
    
    // Returns array of Client objects from all docs in clients.
    static async getClients(arg) {
        let clients = new Array()
        let ref = db.collection('clients')

        if(arg == "active") {
            ref = ref.where("archived", "==", false)
        }else if(arg == "inactive") {
            ref = ref.where("archived", "==", true)
        }

        let result = await ref.get()
   
        result.forEach(doc => {
            let client = new ClientModel()   
            client.docToClient(doc)
            clients.push(client)
        })
        
        return clients
    }

    // Adds a new doc to clients. 
    static async addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active) {  
        let client = new ClientModel(null, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active, [], null)

        db.collection("clients").add(client.toFirestore())
    }

    // Updates existing client doc at clients/{clientId}.
    static async updateClient(clientId, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active) {
        let client = new ClientModel(clientId, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active, [], null)

        db.collection("clients").doc(clientId).set(client.toFirestore())
    }

    // Deletes doc at clients/{clientId}.
    static async deleteClient(clientId) {
        db.collection('clients').doc(clientId).delete()
    }

    // Sets clients/{clientId}/active field to true.
    static async archive(clientId) {
        await db.collection('clients').doc(clientId).update({"archived": true})
    }

    // Sets clients/{clientId}/active field to false. 
    static async unArchive (clientId) {
        await db.collection('clients').doc(clientId).update({"archived": false})
    }

    // Adds {userId} to clients/{clientId}/users array.
    static async addConn(userId, clientId){
        let client = await this.getClient(clientId)

        let users = client.users
        if(!users.includes(userId))
            users.push(userId)

        await db.collection('clients').doc(clientId).update({
            users: users
        })
    }

    static async deleteConn(userId, clientId){
        let client = await this.getClient(clientId)

        let users = client.users

        let index = users.indexOf(userId)
        users.splice(index)

        await db.collection('clients').doc(clientId).update({
            users: users
        })
    }

    static async updateKin(clientId, kinId){
        db.collection("clients").doc(clientId).update({
            kinId : kinId
        })
    }
}











