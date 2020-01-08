class Users{
    static async setupUsers () {
        let users = await UsersDB.getUsers()
        
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
                    return `<a href="javascript:Users.confirmDeactivate('${row.id}')">Deactivate</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Users.viewUserProfile('${row.id}')">View Profile</a>`
                }},
            ],
        })

        this.listeners()
    }

    // Displays selected user details. 
    static async viewUserProfile(userId){
        $('#user-list').hide()
        $('#user-profile').show() 

        let user = await UsersDB.getUser(userId)

        $('#user-profile-title').html(` ${user.name}'s Profile`)
        $('#user-profile-id').text(` ${user.id}`)
        $('#user-profile-name').text(` ${user.name}`)
        $('#user-profile-mobile').text(` ${user.mobile}`)
        $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)

        this.loadConns(userId)
    }

    static async loadConns(userId){
        // Clears connections. 
        $("#user-connections").html("")

        let connections = await ConnsDB.getConns(userId)

        if(connections != null){
            connections.forEach(clientId => {
                ClientsDB.getClient(clientId).then(client => {
                    $("#user-connections").append(`<a href="${client.id}">${client.name}</a><a href="javascript:Users.confirmDeleteConn('${client.id}','${userId}')" style="color:red;"> [X]</a><br>`)
                })
            })
        }
    }

    static async confirmDeleteConn(clientId, userId){
        $('#modal-user-delete-conn').modal('show')
        $('#user-conn-clientidholder').text(clientId)
        $('#user-conn-useridholder').text(userId)
    }

    static async deleteConn(){
        var clientId = $('#user-conn-clientidholder').text()
        var userId = $('#user-conn-useridholder').text()
        $('#modal-user-delete-conn').modal('hide')
        await ConnsDB.deleteConn(clientId, userId) 
        this.loadConns(userId)
    }

    // Prompts user to confirm user deletion. 
    static async confirmDeactivate(userId){
        $('#modal-user-deactivate').modal('show')
        $('#userid-holder').text(userId)
    }

    static async deactivateUser(userId){
        $('#modal-user-deactivate').modal('hide')
        let result = await UsersDB.deactivateUser(userId)
        this.refreshTable()
    }

    static async addConn(){
        let userId = $('#user-profile-id').text().replace(/\s/g, '')
        let clientId = $('#select-client-list').val()

        await ConnsDB.addConn(userId, clientId)
        this.loadConns(userId)
        $('#modal-user-add-connection').modal('hide')
    }

    static async _addConn(){
        $('#modal-user-add-connection').modal('show')
        ClientsDB.getClients().then(clients => {
            clients.forEach(client => {
                $("#select-client-list").append(new Option(`${client.name} : ${client.id}`, client.id))
            })
        })
    }

    // Instantiate listeners.
    static async listeners(){
        $("#btn-user-deactivate").click(function(){
            var userId = $('#userid-holder').text()
            Users.deactivateUser(userId)
        })

        $('#btn-user-add-connection').click(function(){
            Users._addConn()
        })

        $('#form-add-user-conn').submit(function(){
            event.preventDefault()
            Users.addConn()
        })

        $('#btn-user-delete-conn').click(function(){
            Users.deleteConn()
        })
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        let users = await UsersDB.getUsers()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(users)
        table.draw()
    }
}
