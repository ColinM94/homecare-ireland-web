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

        this.loadConns(clientId)
        this.loadVisits(clientId)

        this.listeners()
    }

    static hide(){
        $('#clientsList').show()
        $('#clientProfile').hide() 
    }
    
    // Opens add connection modal form. 
    static async viewAddConnForm(){
        $('#modal-add-connection').modal('show')

        // Clears list. 
        $('#select-add-conn').empty()

        UsersDB.getUsers().then(users => {
            $("#select-add-conn").prepend("<option value='' selected disabled hidden>Select User</option>").val('');
            users.forEach(user => {
                $("#select-add-conn").append(new Option(`${user.role} : ${user.name}`, user.id))
            })
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

        if(connections != null){
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

        UsersDB.getUsers().then(users => {
            $("#select-visit-user").prepend("<option value='' selected disabled hidden>Select User</option>").val('');
            users.forEach(user => {
                $("#select-visit-user").append(new Option(`${user.role} : ${user.name}`, user.id))
            })
        })

        $('#modal-visit-add').modal('hide')
    }

    static async addVisit(){
        let userId = $('#select-visit-user').val()
        let clientId = $('#client-profile-id').text().replace(/\s/g, '')
        let startTime = $('#visit-add-startime').val()
        let endTime = $('#visit-add-endtime').val()

        await VisitsDB.addVisit(userId, clientId, startTime, endTime)

        this.loadVisits() 

        $('#modal-visit-add').modal('hide')
    }

    static async loadVisits(){
        $('#client-visits').empty()

        let visits = await VisitsDB.getAllVisits()

        visits.forEach(visit => {
           $("#client-visits").append(`${visit.startTime}<a href="javascript:ClientProfile.deleteVisit('${visit.id}')" style="color:red;"> [X]</a><br>`)
        })

        console.log(visits)

        //READ THIS!
        //(await visits).forEach
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