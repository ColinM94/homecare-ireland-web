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
            { title: "ID", data: "id", visible: false},
            { title: "Name", data: "name"},
            { title: "Role", data: "role"},
            { title: "Address 1", data: "address1"},
            { title: "Address 2", data: "address2"},
            { title: "Town", data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
            {mRender: function (data, type, row) {
                return `<a href="javascript:confirmUserDeactivate('${row.id}')">Deactivate</a>`
            }},
        ],
    })

    usersListeners()
}

// Prompts user to confirm user deletion. 
function confirmUserDeactivate(userId){
    $('#modal-user-deactivate').modal('show')
    $('#userid-holder').text(userId)
}

async function handleDeactivateUser(userId){
    $('#modal-user-deactivate').modal('hide')
    let result = await deactivateUser(userId)
    console.log(result)
    refreshUsersTable()
}

// Instantiate listeners.
async function usersListeners(){
    $("#btn-user-deactivate").click(function(){
        var userId = $('#userid-holder').text()
        handleDeactivateUser(userId)
    })
}

// Resets and reloads datatable. 
async function refreshUsersTable(){
    let users = await getUsers()
    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(users)
    table.draw()
}