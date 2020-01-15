// Interactions with connections collection in DB.
class ConnsDB{
    // Returns array of user ids from connections/{id}/ids.
    static async getConns(id) {
        let doc = await db.collection('connections').doc(id).get()
        if(doc.data().ids !== null) return doc.data().ids
    }

    // Sets up connection between user and client. 
    static async addConn(id1, id2) {
        await Promise.all([
            await this._addConn(id1, id2),
            await this._addConn(id2, id1)
        ])
    }

    // Adds id to array at connections/{fromId}/ids.
    static async _addConn(fromId, toId){
        await db.collection('connections').doc(fromId).get().then(doc => {
            if(doc != null){
                
                // Array to store connection ids. 
                let newConns = []
                
                if(doc.data().ids != undefined) newConns = doc.data().ids

                // If connection does not exist then add it. 
                if(!newConns.includes(toId)){
                    newConns.push(toId)

                    let data = {
                        ids : newConns
                    }

                    db.collection('connections').doc(fromId).set(data)
                    .then(() => {
                        Message.display(1, "Connection Added")
                    }).catch(error => {
                        console.log(error.message)
                        Message.display(2, "Unable to Add Connection")
                    })
                }
            }
            else{
                console.log("doc does not exist")
            }
        })
    }

    // Deletes connection between users and clients. 
    static async deleteConn(id1, id2){
        await Promise.all([
            this._deleteConn(id1, id2),
            this._deleteConn(id2, id1)
        ]).then(() => {
            Message.display(1, "Connection Deleted")
        }).catch(error => {
            console.log(error.message)
            Message.display(2, "Unable to Delete Connection")
        })
    }

    // Deletes id from connections/{fromId}/ids.
    static async _deleteConn(fromId, toId) {
        let doc = await db.collection('connections').doc(fromId).get()

        let conns = doc.data().ids

        // Removes selected id from array.
        conns.splice(conns.indexOf(toId), 1)

        await this.updateConn(fromId, conns)
    }

    // Deletes all instances of {id} in connections collection.  
    static async deleteConns(id){
        let docs = await db.collection('connections').get()

        // Loops through all docs in connections collection. 
        docs.forEach(doc => {
            let ids = doc.data().ids
            
            // If doc.ids array contains this id then delete that id. 
            if(ids.includes(id)) {
                this.deleteConn(doc.id, id)
            }
        })
    }

    // Updates ids array in DB connections/{id}/ids.
    static async updateConn(id, data){
        let doc = {
            ids : data
        }

        db.collection('connections').doc(id).set(doc)
    }
}


