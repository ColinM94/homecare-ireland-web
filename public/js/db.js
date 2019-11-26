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
    
    db.collection('clients').onSnapshot(data => {
        data.forEach(doc => {
            var client = new Array()
            client[0] = doc.id
            client[1] = doc.data().name
            client[2] = doc.data().maritalstatus
            client[3] = doc.data().mobile
            client[4] = doc.data().telephone
            clients.push(client)
            return clients
        })

        $('#clients').DataTable( {
            data: clients,
            columns: [
                { title: "ID" },
                { title: "Name" },
                { title: "Marital Status"},
                { title: "Mobile"},
                { title: "Telephone"}
            ],
  
        } )
    })
}
