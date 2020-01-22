// Interactions with connections collection in DB.
class ConnsDB{
    // Returns array of user ids from connections/{id}/ids.
    static async getConns(id) {
        let docs 

        // If {id} length > 20 then it is a userId else clientId.
        if(id.length > 20){
            docs = await db.collection('conns').where('userId', '==', id).get()
        }else{
            docs = await db.collection('conns').where('clientId', '==', id).get()
        }

        let conns = []

        docs.forEach(doc => {
            let conn = new Conn()  
            conn.docToConn(doc)
            conns.push(conn)
        })

        return conns
    }

    // Sets up connection between user and client. 
    static async addConn(userId, clientId) {
        let conn = new Conn(null, userId, clientId) 

        await db.collection("conns").add(conn.toFirestore())
    }

        // Deletes connection between users and clients. 
    static async deleteConn(connId){
        await db.collection('conns').doc(connId).delete()
    }
}


    


