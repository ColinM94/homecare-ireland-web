// Sets up connection between user and client. 
async function addConnection(userId, clientId) {
    await Promise.all([
        addConn(userId, clientId),
        addConn(clientId, userId)
    ])
}

async function addConn(id1, id2){
    db.collection('connections').doc(id1).get().then(doc => {
        if(doc != null){
            let newConns = []
 
            if(doc.data().ids != undefined) newConns = doc.data().ids

            if(!newConns.includes(id2)){
                newConns.push(id2)

                let data = {
                    ids : newConns
                }

                db.collection('connections').doc(id1).set(data)
            }
        }
    })
}

async function updateConnection(id, data){
    let doc = {
        ids : data
    }

    db.collection('connections').doc(id).set(doc)
}

async function deleteConnection(clientId, userId) {
    let clientDoc 
    let userDoc

    await Promise.all([
        clientDoc = await db.collection('connections').doc(clientId).get(),
        userDoc = await db.collection('connections').doc(userId).get()
    ])

    clientConnections = clientDoc.data().ids
    userConnections = userDoc.data().ids

    console.log(clientConnections)
    console.log(userConnections)

    let clientIndex = clientConnections.indexOf(clientId)
    clientConnections.splice(clientIndex, 1)

    let userIndex = userConnections.indexOf(userId)
    userConnections.splice(userIndex, 1)

    await Promise.all([
        updateConnection(clientId, clientConnections),
        updateConnection(userId, userConnections)   
    ])
}

// Returns array of user ids.  
async function getConnections(id) {
    let doc = await db.collection('connections').doc(id).get()
    
    if(doc.data().ids !== null) return doc.data().ids
}