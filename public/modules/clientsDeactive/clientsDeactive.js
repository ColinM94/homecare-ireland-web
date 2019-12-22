// Requires that client module is loaded first. 

async function setupClientsDeactive() {
    let clients = await getClientsDeactive()

    $('#datatable').DataTable( {
        data: clients,
        "lengthChange": false,
        paging: false,
        oLanguage: {
            sLengthMenu: "_MENU_",
            sSearch: '', searchPlaceholder: "Search..." 
        },
        initComplete : function() {
            $("#datatable_filter").detach().appendTo('#datatableSearch');
        },
        columns: [
            { title: "ID", data: "id", visible: false},
            { title: "Name", data: "name" },
            { title: "DOB", data: "dob"},
            { title: "Mobile", data: "mobile"},
            { title: "Address 1", data: "address1"},
            { title: "Address 2",data: "address2"},
            { title: "Town",data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
            { title: "Marital Status", data: "marital"},
            {mRender: function (data, type, row) {
                return `<a href="javascript:activateClient('${row.id}')">Activate</a>`
            }},
        ]
    })
}

// Returns array of clients from DB.  
async function getClientsDeactive() {
    let clients = new Array()

    let result = await db.collection('clients').where('active' ,'==', false).get()

    result.forEach(doc => {
        let client = new Client()   
        client.docToClient(doc)
        clients.push(client)
    })

    return clients
}

// Activates client account. 
async function activateClient (clientId) {
    db.collection('clients').doc(clientId).update({
        "active": true
    })

    refreshDeactiveTable()
}

// Resets and reloads datatable. 
async function refreshDeactiveTable(){
    let clients = await getClientsDeactive()
    log("new refresh")
    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(clients)
    table.draw()
}