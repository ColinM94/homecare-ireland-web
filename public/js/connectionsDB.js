// Returns array of user ids.  
async function getConnections(id) {
    let doc = await db.collection('connections').doc(id).get()

    if(doc.data().ids !== null) return doc.data().ids
}

// Sets up connection between user and client. 
async function addConnection(id1, id2) {
    Promise.all([
        addConn(id1, id2),
        addConn(id2, id1)
    ])
}

// Adds id to array in DB connections/{fromId}/ids.
async function addConn(fromId, toId){
    db.collection('connections').doc(fromId).get().then(doc => {
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
            }
        }
        else{
            console.log("doc does not exist")
        }
    })
}

// Deletes connection between users and clients. 
async function deleteConnection(id1, id2){
    await Promise.all([
        deleteConn(id1, id2),
        deleteConn(id2, id1)
    ])
}

// Deletes id in DB from connections/{fromId}/ids.
async function deleteConn(fromId, toId) {
    let doc = await db.collection('connections').doc(fromId).get()

    let conns = doc.data().ids

    // Removes selected id from array.
    conns.splice(conns.indexOf(toId), 1)

    await updateConnection(fromId, conns)
}

// Deletes all instances of this id in connections collection. 
async function deleteConnections(id){
    let docs = await db.collection('connections').get()

    // Loops through all docs in connections collection. 
    docs.forEach(doc => {
        let ids = doc.data().ids
        
        // If doc.ids array contains this id then delete that id. 
        if(ids.includes(id)) {
            deleteConnection(doc.id, id)
        }
    })
}

// Updates ids array in DB connections/{id}/ids.
async function updateConnection(id, data){
    let doc = {
        ids : data
    }

    db.collection('connections').doc(id).set(doc)
}

