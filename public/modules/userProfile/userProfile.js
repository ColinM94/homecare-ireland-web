class UserProfile{
    static overlay = true
    static userId = null

    static async load(userId){
        this.userId = userId

        let user = await UsersDB.getUser(userId)

        $('#user-profile-title').html(` User Profile: ${user.name}`)
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
                    $("#user-connections").append(`<a href="javascript:Module.load('ClientProfile', '${client.id}')">${client.name}</a><a href="javascript:UserProfile.deleteConn('${client.id}')" style="color:red;"> [X]</a><br>`)
                })
            })
        }
    }

    static async deleteConn(clientId){
        if(await Prompt.confirm()){
            $('#modal-user-delete-conn').modal('hide')
            await ConnsDB.deleteConn(clientId, this.userId) 
            this.loadConns(this.userId)
        }
    }

    static async viewAddConnForm(){
        $('#modal-add-connection').modal('show')

        // Clears list. 
        $('#select-add-conn').empty()

        ClientsDB.getClients().then(clients => {
            $("#select-add-conn").prepend("<option value='' selected disabled hidden>Select Client</option>").val('');
            clients.forEach(client => {
                $("#select-add-conn").append(new Option(`${client.name}`, client.id))
            })
        }) 
    }

    static async addConn(){
        let clientId = $('#select-add-conn').val()

        await ConnsDB.addConn(this.userId, clientId)
        this.loadConns(this.userId)
        $('#modal-user-add-connection').modal('hide')

        $('#modal-add-connection').modal('hide')
    }

    // Instantiate listeners.
    static async listeners(){
        $('#btn-user-add-conn').click(function(){
            UserProfile.viewAddConnForm()
        })

        $('#form-add-conn').submit(function(){
            event.preventDefault()
            UserProfile.addConn()
        })

        $('#btn-user-delete-conn').click(function(){
            UserProfile.deleteConn()
        })

        $('#btn-close-user-profile').click(function(){
            console.log("hello")
            Module.closeOverlay()
        })
    }
}