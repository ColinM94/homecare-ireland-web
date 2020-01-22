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

        ConnsDB.getConns(this.userId)
            .then(conns => {
                if(conns.length < 1){
                    $("#user-connections").append("No Connections!")
                }else{
                    conns.forEach(conn => {
                        ClientsDB.getClient(conn.clientId).then(client => {
                            $("#user-connections").append(`<a href="javascript:Module.load('ClientProfile', '${client.id}')">${client.name}</a><a href="javascript:UserProfile.deleteConn('${conn.id}')" style="color:red;"> [X]</a><br>`)
                        })
                    })
                }           
            }).catch(error => {
                Message.display(2, "Failed to load connections")
                console.log(error.message)
            })
    }

    static async loadVisits(){
        $('#user-visits').empty()

        VisitsDB.getVisits(this.userId)
            .then(visits => {
                if(visits.length < 1){
                    $("#user-visits").append("No Visits!")
                }else{
                    visits.forEach(visit => {
                        $("#user-visits").append(`<a href="javascript:Module.load('VisitDetails', '${visit.id}')">${visit.startDate} : ${visit.startTime} - ${visit.endTime}</a> <a href="javascript:ClientProfile.deleteVisit('${visit.id}')" style="color:red;"> [X]</a><br>`)
                    })
                }
            }).catch(error => {
                Message.display("Failed to load visits")
                Console.log(error.message)    
            })
    }

    static async deleteConn(connId){
        if(await Prompt.confirm()){
            await ConnsDB.deleteConn(connId)
                .then(() => {
                    Message.display(1, "Connection deleted")
                }).catch(error => {
                    Message.display(2, "Unable to delete connection")
                })
            
            $('#modal-user-delete-conn').modal('hide')
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

        console.log(conns)
        console.log(allClients)

        // Clients which are not connected to this user. 
        let clients = []

        allClients.forEach(client => {
            // True if connection is found. 
            let found = false

            conns.forEach(conn => {
                // If connection is already exists.
                if(conn.clientId == client.id) found = true
            })

            // If connection doesn't exist add it.
            if(found == false) clients.push(client)
        })

        clients.forEach(client => {
            $("#select-add-conn").append(new Option(`${client.name} : ${client.address1}, ${client.address2}, ${client.county}`, client.id))
        })
    }

    static async addConn(){
        let clientId = $('#select-add-conn').val()

        await ConnsDB.addConn(this.userId, clientId)
            .then(() => {
                this.loadConns()
                Message.display(1, "Connection added")
            }).catch(error => {
                Message.display(2, "Failed to add connection")
                console.log(error.message)
            })

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