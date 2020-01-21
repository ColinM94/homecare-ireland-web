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

        this.loadConns()
        this.loadVisits()
        this.listeners()
    }

    static async loadConns(){
        // Clears connections. 
        $("#user-connections").html("")

        let connections = await ConnsDB.getConns(this.userId)

        if(connections.length < 1){
            $("#user-connections").append("No Connections!")
        }else{
            connections.forEach(clientId => {
                ClientsDB.getClient(clientId).then(client => {
                    $("#user-connections").append(`<a href="javascript:Module.load('ClientProfile', '${client.id}')">${client.name}</a><a href="javascript:UserProfile.deleteConn('${client.id}')" style="color:red;"> [X]</a><br>`)
                })
            })
        }
    }

    static async loadVisits(){
        $('#user-visits').empty()

        let visits = await VisitsDB.getVisits(this.userId)

        if(visits.length < 1){
            $("#user-visits").append("No Visits!")
        }else{
            visits.forEach(visit => {
                $("#user-visits").append(`<a href="javascript:Module.load('VisitDetails', '${visit.id}')">${visit.startDate} : ${visit.startTime} - ${visit.endTime}</a> <a href="javascript:ClientProfile.deleteVisit('${visit.id}')" style="color:red;"> [X]</a><br>`)
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

        let conns, allClients

        await Promise.all([
            conns = await ConnsDB.getConns(this.userId),
            allClients = await ClientsDB.getActiveClients()
        ])

        // Clients which are not connected to this user. 
        let clients = []
        allClients.forEach(client => {
            if(!conns.includes(client.id)){
                clients.push(client)
            }
        })

        clients.forEach(client => {
            $("#select-add-conn").append(new Option(`${client.name} : ${client.address1}, ${client.address2}, ${client.county}`, client.id))
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
            Module.closeOverlay()
        })
    }
}