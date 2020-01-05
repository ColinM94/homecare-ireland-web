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
            {mRender: function (data, type, row) {
                return `<a href="javascript:viewUserProfile('${row.id}')">View Profile</a>`
            }},
        ],
    })

    usersListeners()
}

// Displays selected user details. 
async function viewUserProfile(userId){
    $('#user-list').hide()
    $('#user-profile').show() 

    await Promise.all([
        getUser(userId).then(user => {    
            $('#user-profile-title').html(` ${user.name}'s Profile`)
            $('#user-profile-id').text(` ${user.id}`)
            $('#user-profile-name').text(` ${user.name}`)
            $('#user-profile-mobile').text(` ${user.mobile}`)
            $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)
        }),
        getUserConnections(userId).then(clients => {
            clients.forEach(clientId => {
                getClient(clientId).then(client => {
                    $("#user-connections").append(`<a href="${client.id}">${client.name}</a>`)
                })
            })
        })
    ])  
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

    $('#btn-user-add-connection').click(function(){
        $('#modal-user-add-connection').modal('show')
        getClients().then(clients => {
            clients.forEach(client => {
                $("#select-client-list").append(new Option(`${client.name} : ${client.id}`, client.id))
            })
        })
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