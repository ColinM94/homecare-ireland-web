class ClientProfile{
    static overlay = true
    static clientId = null

    static async load(clientId){  
        this.clientId = clientId

        let client = await ClientsDB.getClient(clientId)
        
        $('#client-profile-id').text(` ${client.id}`)
        $('#client-profile-title').html(` Client: ${client.name}'s Profile`)
        $('#client-profile-name').text(` ${client.name}`)
        $('#client-profile-dob').text(` ${client.dob}`)
        $('#client-profile-mobile').text(` ${client.mobile}`)
        $('#client-profile-address').text(` ${client.address1}, ${client.address2}, ${client.town}, ${client.county}, ${client.eircode}`)

        this.loadConns()
        this.loadVisits()
        this.listeners()
    }

    // <-- CONNECTIONS --> //

    // Opens add connection modal form. 
    static async viewAddConnForm(){ 
        // Clears list. 
        $('#select-client-add-conn').empty()

        $('#modal-client-add-conn').modal('show')

        let conns, allUsers

        await Promise.all([
            conns = await ConnsDB.getConns(this.clientId),
            allUsers = await UsersDB.getActiveUsers()
        ])

        let users = []

        allUsers.forEach(user => {
            // True if connection is found. 
            let found = false

            conns.forEach(conn => {
                // If connection is already exists.
                if(conn.userId == user.id) found = true
            })

            // If connection doesn't exist add it.
            if(found == false) users.push(user)
        })
        console.log(users)
        users.forEach(user => {
            $("#select-client-add-conn").append(new Option(`${user.name}`, user.id))
        })
    }

    static async addConn(){
        let userId = $('#select-client-add-conn').val()
        await ConnsDB.addConn(userId, this.clientId)
        $('#modal-client-add-conn').modal('hide')
        this.loadConns()
    }

    static async deleteConn(connId){
        await Profile.deleteConn(connId)
        console.log(connId)
        this.loadConns(this.userId)
    }

    // Gets and displays connections. 
    static async loadConns(){
        // Clears client connections. 
        $("#client-connections").html("")

        let conns = await ConnsDB.getConns(this.clientId)

        if(conns.length < 1){
            $("#client-connections").append("No Connections")
        }else{
            conns.forEach(conn => {
                UsersDB.getUser(conn.userId).then(user => {
                    $("#client-connections").append(`${user.role}: <a href="javascript:Module.load('UserProfile', '${user.id}')">${user.name}</a> <a href="javascript:ClientProfile.deleteConn('${conn.id}')" style="color:red;">[X]</a><br>`)
                })
            })
        }
    }

    // <-- VISITS --> //
    static async viewAddVisitForm(){
        $('#modal-client-add-visit').modal('show')

        $('#select-visit-user').empty()

        UsersDB.getActiveUsers().then(users => {
            $("#select-visit-user").prepend("<option value='' selected disabled hidden>Select User</option>").val('');
            users.forEach(user => {
                $("#select-visit-user").append(new Option(`${user.role} : ${user.name}`, user.id))
            })
        })

        $('#modal-visit-add').modal('hide')
    }

    static async addVisit(){
        let userId = $('#select-visit-user').val()
        var startDate = $('#visit-add-start-date').val()
        var startTime = $('#visit-add-start-time').val()
        var endDate = $('#visit-add-end-date').val()
        let endTime = $('#visit-add-end-time').val()
        let note = $('#visit-add-note').val()

        await VisitsDB.addVisit(userId, this.clientId, startDate, startTime, endDate, endTime, note)
            .catch(error => {
                Message.display(2, "Failed to add visit")
                console.log(error.message)
            })

        this.loadVisits() 

        $('#modal-client-add-visit').modal('hide')
    }

    static async deleteVisit(visitId){
        await Profile.deleteVisit(visitId)
        this.loadVisits()
    }

    static async loadVisits(){
        $('#client-visits').empty()

        VisitsDB.getVisits(this.clientId)
            .then(visits => {
                if(visits.length < 1){
                    $("#client-visits").append("No Visits!")
                }else{
                    visits.forEach(visit => {
                        $("#client-visits").append(`<a href="javascript:Module.load('VisitDetails', '${visit.id}')">${visit.startDate} : ${visit.startTime} - ${visit.endTime}</a> <a href="javascript:ClientProfile.deleteVisit('${visit.id}')" style="color:red;"> [X]</a><br>`)
                    })
                }
            }).catch(error => {
                console.log(error.message)
                Message.display(2, "Unable to load visits")
            })
    }

    // Instantiate listeners. 
    static listeners() {
        $('#btn-close-client-profile').click(function(){
            Module.closeOverlay()
        })

        $('#btn-client-delete-conn').click(function(){
            ClientProfile.deleteConn()
        })

        $('#btn-client-add-visit').click(function(){
            ClientProfile.viewAddVisitForm()
        })

        $('#form-add-visit').submit(function(event){
            event.preventDefault()
            ClientProfile.addVisit()
        })

        $('#form-client-add-conn').submit(function(event){
            event.preventDefault()
            ClientProfile.addConn()
        })

        $('#btn-client-add-conn').click(function(){
            ClientProfile.viewAddConnForm()
        })

        $('#form-add-conn').submit(function(){
            event.preventDefault()
            ClientProfile.addConn()
        })
    }
}