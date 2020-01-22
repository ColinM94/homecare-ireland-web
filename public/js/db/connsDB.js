// Interactions with connections collection in DB.
class ConnsDB{
    // Returns array of Conn objects where doc contains user/client id.
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

    // Deletes connections containing user/client id.
    static async deleteConns(id){
        let conns = await this.getConns(id)

        conns.forEach(conn => {
            this.deleteConn(conn.id)
        })
    }

    // Deletes doc with id of {connId} from conns collection. 
    static async deleteConn(connId){
        await db.collection('conns').doc(connId).delete()
    }
}


    


