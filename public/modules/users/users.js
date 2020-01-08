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

    let user = await getUser(userId)

    $('#user-profile-title').html(` ${user.name}'s Profile`)
    $('#user-profile-id').text(` ${user.id}`)
    $('#user-profile-name').text(` ${user.name}`)
    $('#user-profile-mobile').text(` ${user.mobile}`)
    $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)

    loadUserConns(userId)
}

async function loadUserConns(userId){
    // Clears connections. 
    $("#user-connections").html("")

    let connections = await getConnections(userId)

    if(connections != null){
        connections.forEach(clientId => {
            getClient(clientId).then(client => {
                $("#user-connections").append(`<a href="${client.id}">${client.name}</a><a href="javascript:confirmDeleteUserConn('${client.id}','${userId}')" style="color:red;"> [X]</a><br>`)
            })
        })
    }
}

function confirmDeleteUserConn(clientId, userId){
    $('#modal-user-delete-conn').modal('show')
    $('#user-conn-clientidholder').text(clientId)
    $('#user-conn-useridholder').text(userId)
}

async function deleteUserConnHandler(){
    var clientId = $('#user-conn-clientidholder').text()
    var userId = $('#user-conn-useridholder').text()
    $('#modal-user-delete-conn').modal('hide')
    await deleteConnection(clientId, userId) 
    loadUserConns(userId)
}

// Prompts user to confirm user deletion. 
function confirmUserDeactivate(userId){
    $('#modal-user-deactivate').modal('show')
    $('#userid-holder').text(userId)
}

async function handleDeactivateUser(userId){
    $('#modal-user-deactivate').modal('hide')
    let result = await deactivateUser(userId)
    refreshUsersTable()
}

async function addUserConnHandler(){
    let userId = $('#user-profile-id').text().replace(/\s/g, '')
    let clientId = $('#select-client-list').val()

    await addConnection(userId, clientId)
    loadUserConns(userId)
    $('#modal-user-add-connection').modal('hide')
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

    $('#form-add-user-conn').submit(function(){
        event.preventDefault()
        addUserConnHandler()
    })

    $('#btn-user-delete-conn').click(function(){
        deleteUserConnHandler()
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