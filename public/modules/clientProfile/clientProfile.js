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
        $('#modal-add-connection').modal('show')

        // Clears list. 
        $('#select-add-conn').empty()

        let conns, allUsers

        await Promise.all([
            conns = await ConnsDB.getConns(this.clientId),
            allUsers = await UsersDB.getActiveUsers()
        ])

        // Users which are not connected to this client. 
        let users = [] 
        allUsers.forEach(user => {
            if(!conns.includes(user.id)){
                users.push(user)
            }
        })

        await UsersDB.getActiveUsers()
        
        $("#select-add-conn").prepend("<option value='' selected disabled hidden>Select User</option>").val('');
        users.forEach(user => {
            $("#select-add-conn").append(new Option(`${user.role} : ${user.name}`, user.id))
        })

        $('#modal-add-connection').modal('hide')
    }

    static async addConn(){
        let userId = $('#select-add-conn').val()

        await ConnsDB.addConn(userId, this.clientId)
        this.loadConns()
        $('#modal-add-connection').modal('hide')
    }

    static async deleteConn(userId){
        if(await Prompt.confirm()){ 
            $('#modal-client-delete-conn').modal('hide')
            await ConnsDB.deleteConn(this.clientId, userId) 
            this.loadConns(this.clientId)
        }
    }

    // Gets and displays connections. 
    static async loadConns(){
        // Clears client connections. 
        $("#client-connections").html("")

        let connections = await ConnsDB.getConns(this.clientId)

        if(connections.length < 1){
            $("#client-connections").append("No Connections")
        }else{
            connections.forEach(userId => {
                UsersDB.getUser(userId).then(user => {
                    $("#client-connections").append(`${user.role}: <a href="javascript:Module.load('UserProfile', '${user.id}')">${user.name}</a> <a href="javascript:ClientProfile.deleteConn('${user.id}')" style="color:red;">[X]</a><br>`)
                })
            })
        }
    }

    // <-- VISITS --> //
    static async viewAddVisitForm(){
        $('#modal-visit-add').modal('show')

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

        await VisitsDB.addVisit(userId, this.clientId, startDate, startTime, endDate, endTime)
            .catch(error => {
                Message.display(error.message)
                console.log("Failed to add visit")
            })

        this.loadVisits() 

        $('#modal-visit-add').modal('hide')
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

    static async deleteVisit(visitId){
        if(await Prompt.confirm()) {
            await VisitsDB.deleteVisit(visitId)
            this.loadVisits()
        }
    }

    // Instantiate listeners. 
    static async listeners() {
        $('#btn-close-client-profile').click(function(){
            Module.closeOverlay()
        })

        $("#form-add-conn").submit(function(event) {
            event.preventDefault()
            ClientProfile.addConn()
        })

        $('#btn-client-add-conn').click(function(){
            ClientProfile.viewAddConnForm()
        })

        $('#btn-client-delete-conn').click(function(){
            ClientProfile.deleteConn()
        })

        $('#btn-add-visit').click(function(){
            ClientProfile.viewAddVisitForm()
        })

        $('#form-add-visit').submit(function(event){
            event.preventDefault()
            ClientProfile.addVisit()
        })
    }
}