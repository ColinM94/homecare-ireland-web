async function setupUsers () {
    let users = await getUsers()
    
    $('#datatable').DataTable({
        data: users,
        "lengthChange": false,
        oLanguage: {
            sLengthMenu: "_MENU_",
            sSearch: '', searchPlaceholder: "Search..." 
        },
        initComplete : function() {
            $("#datatable_filter").detach().appendTo('#datatableSearch');
        },
        columns: [
            { title: "Name", data: "name"},
            { title: "Role", data: "role"},
            { title: "Address 1", data: "address1"},
            { title: "Address 2", data: "address2"},
            { title: "Town", data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
        ],
        "bLengthChange": false
    })
}

// Returns array of users from DB.
async function getUsers() {
    let users = new Array()

    let result = await db.collection('userDetails').get()
    result.forEach(doc => {
        let user = new User()   
        user.docToUser(doc)
        users.push(user)
    })

    return users
}

class User {
    constructor(id, role, name, address1, address2, town, county, eircode) {
        this.id = id
        this.role = role
        this.name = name
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
    }

    docToUser(doc) {
        this.id = doc.id
        this.role = doc.data().role
        this.name = doc.data().name
        this.address1 = doc.data().address1
        this.address2 = doc.data().address2
        this.town = doc.data().town
        this.county = doc.data().county
        this.eircode = doc.data().eircode
    }
}