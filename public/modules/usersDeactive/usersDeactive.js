// Requires that client module is loaded first. 
async function setupUsersDeactive() {
    let users = await getUsersDeactive()

    $('#datatable').DataTable({
        data: users,
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
            { title: "Address 1", data: "address1"},
            { title: "Address 2",data: "address2"},
            { title: "Town",data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
            {mRender: function (data, type, row) {
                return `<a href="javascript:activateUserClick('${row.id}')">Activate</a>`
            }},
        ]
    })
}

function activateUserClick(userId) {
    activateUser(userId)
    refreshUserDeactiveTable()
}

// Resets and reloads users datatable. 
async function refreshUserDeactiveTable(){
    let users = await getUsersDeactive()
    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(users)
    table.draw()
}