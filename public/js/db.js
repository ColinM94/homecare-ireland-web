var currentUser = {}

function getUserInfo(user){
    db.collection('users').doc(user.uid).get().then(doc =>{
        currentUser = {
            id : user.uid,
            email : user.email,
            name :  doc.data().name

        }
        setupUI()
    })
}

function setupUI(){
    document.getElementById("topbar-name").innerHTML = currentUser.name  
}

function setupUsers () {
    var users = new Array()
    
    db.collection('users').onSnapshot(data => {
        data.forEach(doc => {
            var user = new Array()
            user[0] = doc.id
            user[1] = doc.data().name
            users.push(user)
            return users
        })

        $('#users').DataTable( {
            data: users,
            columns: [
                { title: "ID"},
                { title: "Name" }
            ],
            "bLengthChange": false
        } )
    })
}

function setupClients () {
    var clients = new Array()
 
    var clientDetails = db.collection('clientDetails').get().then( snapshot => {
        snapshot.forEach(doc => {
            var client = new Array()

            client[0] = doc.id
            client[1] = doc.data().name
            client[2] = doc.data().address1
            client[3] = doc.data().address2
            client[4] = doc.data().town
            client[5] = doc.data().county
            client[6] = doc.data().eircode
            client[7] = doc.data().mobile
            client[8] = doc.data().marital

            clients.push(client)
        })

            $('#clients').DataTable( {
            data: clients,
            columns: [
                { title: "ID" },
                { title: "Name" },
                { title: "Address 1"},
                { title: "Address 2"},
                { title: "Town"},
                { title: "County"},
                { title: "Eircode"},
                { title: "Mobile"},
                { title: "Marital Status"},
            ],
        })
    })
}

