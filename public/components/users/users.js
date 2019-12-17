function setupUsers () {
    var users = new Array()
    
    db.collection('userDetails').onSnapshot(data => {
        data.forEach(doc => {
            var user = new Array()
            user[0] = doc.id
            user[1] = doc.data().role
            user[2] = doc.data().name
            user[3] = doc.data().address1
            user[4] = doc.data().address2
            user[5] = doc.data().town
            user[6] = doc.data().county
            user[7] = doc.data().eircode
            users.push(user)
            return users
        })

        $('#users').DataTable( {
            data: users,
            columns: [
                { title: "ID"},
                { title: "Role"},
                { title: "Name"},
                { title: "Address 1"},
                { title: "Address 2"},
                { title: "Town"},
                { title: "County"},
                { title: "Eircode"},
            ],
            "bLengthChange": false
        } )
    })
}