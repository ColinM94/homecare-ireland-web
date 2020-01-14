class UserProfile{
    static overlay = true
    static userId = null

    static async load(userId){
        this.userId = userId

        let user = await UsersDB.getUser(userId)

        $('#user-profile-title').html(` ${user.name}'s Profile`)
        $('#user-profile-id').text(` ${user.id}`)
        $('#user-profile-name').text(` ${user.name}`)
        $('#user-profile-mobile').text(` ${user.mobile}`)
        $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)

        this.loadConns(userId)

        this.listeners()
    }

    static async loadConns(userId){
        // Clears connections. 
        $("#user-connections").html("")

        let connections = await ConnsDB.getConns(userId)

        if(connections != null){
            connections.forEach(clientId => {
                ClientsDB.getClient(clientId).then(client => {
                    $("#user-connections").append(`<a href="javascript:Module.load('ClientProfile', '${client.id}')">${client.name}</a><a href="javascript:Users.deleteConn('${client.id}','${userId}')" style="color:red;"> [X]</a><br>`)
                })
            })
        }
    }

    static async deleteConn(){
        if(await Prompt.confirm()){
            var clientId = $('#user-conn-clientidholder').text()
            var userId = $('#user-conn-useridholder').text()
            $('#modal-user-delete-conn').modal('hide')
            await ConnsDB.deleteConn(clientId, userId) 
            this.loadConns(userId)
        }
    }

    static async addConn(){
        let userId = $('#user-profile-id').text().replace(/\s/g, '')
        let clientId = $('#select-client-list').val()

        await ConnsDB.addConn(userId, clientId)
        this.loadConns(userId)
        $('#modal-user-add-connection').modal('hide')
    }

    // Instantiate listeners.
    static async listeners(){
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

        $('#btn-close-user-profile').click(function(){
            console.log("hello")
            Module.closeOverlay()
        })
    }
}