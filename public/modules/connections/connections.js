function addConnection(){
    var userId = $("#connection-userid").val()
    var clientId = $("#connection-clientid").val()

    log(userId)
    log(clientId)

    db.collection('connections').doc(userId).get().then(doc => {
        if(doc.exists){
            var newClients = doc.data().clients

            if(!newClients.includes(clientId)){
                newClients.push(clientId)

                let data = {
                    clients : newClients
                }

                db.collection('connections').doc(userId).set(data);
            }

        }else{
            var newClients = [clientId]

            let data = {
                clients : newClients
            }

            db.collection('connections').doc(userId).set(data);
        }
    })

    db.collection('connections').doc(clientId).get().then(doc => {
        if(doc.exists){
            var newUsers = doc.data().users

            if(!newUsers.includes(userId)){
                newUsers.push(userId)

                newUsers.push(userId)

                let data = {
                    connections: newUsers
                }

                db.collection('connections').doc(clientId).set(data)
            }
            
        }else{
            var newUsers = [userId]

            let data = {
                users : newUsers
            }

            db.collection('connections').doc(clientId).set(data);
        }
    })
    
    return false
}