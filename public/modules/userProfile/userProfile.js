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
                Notification.display(2, "Failed to load connections")
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
                        $("#user-visits").append(`<a href="javascript:Module.load('VisitDetails', '${visit.id}')">${visit.startDate} : ${visit.startTime} - ${visit.endTime}</a> <a href="javascript:Profile.deleteVisit('${visit.id}')" style="color:red;"> [X]</a><br>`)
                    })
                }
            }).catch(error => {
                Notification.display("Failed to load visits")
                Console.log(error.message)    
            })
    }

    static async viewAddConnForm(){
        $('#modal-add-client').modal('show')

        // Resets modal.  
        $('#select-client').empty()
        $('#select-client').removeAttr('disabled')
        $('#btn-modal-add-client').removeAttr('disabled')

        let conns, allClients

        await Promise.all([
            conns = await ConnsDB.getConns(this.userId),
            allClients = await ClientsDB.getActiveClients()
        ])

        allClients.forEach(client => {
            // True if connection is found. 
            let found = false

            conns.forEach(conn => {
                // If connection already exists.
                if(conn.clientId == client.id) found = true
            })

            // If connection doesn't exist add it.
            if(found == false){
                $("#select-client").append(new Option(`${client.name} : ${client.address1}, ${client.address2}, ${client.county}`, client.id))
            }
        })

        if(!$('#select-client').has('option').length > 0){
            $("#select-client").append(new Option('No Clients Found!'))
            $('#select-client').attr('disabled', true)
            $('#btn-modal-add-client').attr('disabled', true)
        }
    }

    static async addConn(){
        let clientId = $('#select-client').val()
        await ConnsDB.addConn(this.userId, clientId)
        $('#modal-add-client').modal('hide')
        this.loadConns()
    }

    static async deleteConn(connId){
        await Profile.deleteConn(connId)
        this.loadConns()
    }

    // Instantiate listeners.
    static async listeners(){
        $('#btn-user-add-client').click(function(){
            UserProfile.viewAddConnForm()
        })

        $('#form-user-add-client').submit(function(){
            event.preventDefault()
            UserProfile.addConn()
        })

        $('#btn-close-user-profile').click(function(){
            Module.closeOverlay()
        })

        $('#btn-user-delete-conn').click(function(){
            UserProfile.deleteConn()
        })
    }
}