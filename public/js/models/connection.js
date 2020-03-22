class Connection {
    constructor(id, userId, clientId){
        this.id = id
        this.userId = userId
        this.clientId = clientId
    }

    docToConn(doc){
        this.id = doc.id
        this.userId = doc.data().userId
        this.clientId = doc.data().clientId
    }

    toFirestore(){
        let conn = {
            userId : this.userId,
            clientId : this.clientId
        }

        return conn
    }
}