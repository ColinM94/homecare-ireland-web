const userList = document.querySelector('.users')
const signedOutLinks = document.querySelectorAll('.signed-out')
const signedInLinks = document.querySelectorAll('.signed-in')
const accountDetails = document.querySelector('.account-details')
const adminItems = document.querySelectorAll('.admin')

const setupUI = (user) => {
    if (user){     
        
        // Account info 
        db.collection('users').doc(user.uid).get().then(doc =>{
            const userInfo = doc.data()
            const html = `
            <div>${user.email}</div>
            <div>${userInfo.firstname} ${userInfo.lastname}</div>
            <div>${user.admin ? 'You are an admin' : 'You'}</div>
        `
        accountDetails.innerHTML = html
        })
        
        // Toggle UI elements
        signedInLinks.forEach(link => link.style.display = 'block')
        signedOutLinks.forEach(link => link.style.display = 'none')
    }
    else{
        signedInLinks.forEach(link => link.style.display = 'none')
        signedOutLinks.forEach(link => link.style.display = 'block')
    }
}

function setupUsers () {
    console.log("Hello")
    var users = new Array()

    db.collection('users').onSnapshot(data => {
        data.forEach(doc => {
            const data = doc.data()
            var user = [data.firstname, data.lastname, data.role]
            users.push(user)
            return users
        })
        

          //$('#data-table').DataTable().fnDestroy();
         // $('#data-table').empty();

        
        $('#data-table').DataTable( {
            destroy: true,
            data: users,
            columns: [
                { title: "First Name" },
                { title: "Last Name" },
                { title: "Role"}
            ],
            "bLengthChange": false
        } )
      
    })
}

function setupClients () {
    //var table = $('#data-table').DataTable();
    //table.fnDestroy()


    var clients = new Array()
    
    db.collection('clients').onSnapshot(data => {
        data.forEach(doc => {
            const data = doc.data()
            var client = [data.firstname, data.lastname]
            clients.push(client)
            return client
        })
        
        $('#data-table').DataTable( {
            data: clients,
            columns: [
                { title: "First Name" },
                { title: "Last Name" }
            ],
            "bLengthChange": false
        } )
    })
}

document.addEventListener('DOMContentLoaded', function(){

})
