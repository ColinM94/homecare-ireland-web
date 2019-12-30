// Requires that client module is loaded first. 
async function setupClientsDeactive() {
    let clients = await getClientsDeactive()

    $('#datatable').DataTable({
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
                return `<a href="javascript:activateClientClick('${row.id}')">Activate</a>`
            }},
        ]
    })
}

function activateClientClick(clientId) {
    activateClient(clientId)
    refreshDeactiveTable()
}

// Resets and reloads datatable. 
async function refreshDeactiveTable(){
    let clients = await getClientsDeactive()
    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(clients)
    table.draw()
}