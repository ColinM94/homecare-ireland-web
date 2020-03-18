class ClientProfile{
    static overlay = true
    static clientId = null
    static active 

    static async load(clientId){  
        this.clientId = clientId

        await ClientsDB.getClient(clientId)
            .then(client => {
                $('#client-profile-id').text(` ${client.id}`)
                if(client.active)
                    $('#client-profile-title').html(` Client : ${client.name}'s Profile`)
                else
                    $('#client-profile-title').html(` Client : ${client.name}'s Profile <span style="color:red">(Deactive)</span>`)

                $('#client-profile-name').text(` ${client.name}`)
                $('#client-profile-dob').text(` ${client.dob}`)
                $('#client-profile-mobile').text(` ${client.mobile}`)
                $('#client-profile-address').text(` ${client.address1}, ${client.address2}, ${client.town}, ${client.county}, ${client.eircode}`)
                this.active = client.active

                this.loadConns()
                this.loadVisits()
                this.listeners()
            }).catch(error => {
                console.log(error.message)
                Notification.display(2, "Unable to load client details")
                closeOverlay()
            })
    }

    // <-- CONNECTIONS --> //

    // Opens add connection modal form. 
    static async viewAddConnForm(){ 
        $('#modal-add-carer').modal('show')

        // Resets modal.  
        $('#select-carer').empty()
        $('#select-carer').removeAttr('disabled')
        $('#btn-modal-add-carer').removeAttr('disabled')

        $("#select-carer").prepend("<option value='' selected disabled hidden>Select Carer</option>").val('')

        let conns, allUsers

        await Promise.all([
            conns = await ConnsDB.getConns(this.clientId),
            allUsers = await UsersDB.getActiveCarers()
        ])

        allUsers.forEach(user => {
            // True if connection is found. 
            let found = false

            conns.forEach(conn => {
                // If connection already exists.
                if(conn.userId == user.id) found = true
            })

            // If connection doesn't exist add it.
            if(found == false){
                $("#select-carer").append(new Option(`${user.name} : ${user.address1}, ${user.address2}, ${user.county}`, user.id))
            }
        })

        if(!$('#select-carer').has('option').length > 0){
            $("#select-carer").append(new Option('No Carers Found!'))
            $('#select-carer').attr('disabled', true)
            $('#btn-modal-add-carer').attr('disabled', true)
        }
    }

    static async addConn(){
        let userId = $('#select-carer').val()

        if(!userId){
            Notification.formError("Please select a carer!")
        }else{
            Notification.formError("")

            await ConnsDB.addConn(userId, this.clientId)
                .then(() => {
                    Notification.display(1, "Connection created")
                }).catch(error => {
                    Notification.display(2, "Unable to create connection")
                })

            $('#modal-add-carer').modal('hide')
            this.loadConns()
        }
    }

    static async deleteConn(connId){
        await Profile.deleteConn(connId)
        this.loadConns(this.userId)
    }

    // Gets and displays connections. 
    static async loadConns(){
        // Clears client connections. 
        $("#client-connections").html("")

        await ConnsDB.getConns(this.clientId)
            .then(conns => {
                if(conns.length < 1){
                    $("#client-connections").append("No Connections!")
                }else{
                    conns.forEach(conn => {
                        UsersDB.getUser(conn.userId).then(user => {
                            $("#client-connections").append(`<a href="javascript:Module.load('UserProfile', '${user.id}')">${user.name}</a> <a href="javascript:ClientProfile.deleteConn('${conn.id}')" style="color:red;">[X]</a><br>`)
                        })
                    })
                }
            }).catch(error => {
                console.log(error.message)
                Notification.display("Unable to load connections!")
            })  
    }

    // <-- VISITS --> //
    static async viewAddVisitForm(){
        $('#modal-add-visit').modal('show')

        $('#select-visit-user').empty()

        let conns = await ConnsDB.getConns(this.clientId)

        UsersDB.getActiveCarers().then(users => {
            $("#visit-select-user").prepend("<option value='' selected disabled hidden>Select Carer</option>").val('')

            // Add carers connected to this client to dropdown list.
            users.forEach(user => {
                conns.forEach(conn => {
                    if((conn.userId) == user.id){
                        $("#visit-select-user").append(new Option(`${user.role} : ${user.name}`, user.id))
                    }
                })
            })
        })

        $('#modal-visit-add').modal('hide')
    }

    static async addVisit(){
        let userId = $('#visit-select-user').val()
        let start = new Date($('#visit-add-start').val()).getTime()
        let end = new Date($('#visit-add-end').val()).getTime()
        let note = $('#visit-add-note').val()

        if(!userId){
            Notification.formError("Please select a carer!")
        }else if(!userId){
            Notification.formError("Please select a carer!")
        }else if(!start){
            Notification.formError("Please select a start date!")
        }else if(!end){
            Notification.formError("Please select a start time!")
        }else if(Date.now() > start){
            Notification.formError("New visits cannot take place in the past!")
        }else if(start > end){
            Notification.formError("The visit cannot end before it starts!")
        }else{
            Notification.formError("")

            await VisitsDB.addVisit(userId, this.clientId, start, end, note)
                .then(() => {
                    this.loadVisits() 
                    $('#modal-add-visit').modal('hide')

                }).catch(error => {
                    Notification.display(2, "Failed to add visit")
                    console.log(error.message)
                })
        }     
    }

    static async deleteVisit(visitId){
        await Profile.deleteVisit(visitId)
        this.loadVisits()
    }

    static async loadVisits(){
        let visits = await VisitsDB.getVisits(this.clientId)

        $('#datatable-profile').DataTable( {
            data: visits,
            lengthChange: false,
            paging: false,
            bFilter: true,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { targets: 0, title: "User ID", data: "userId"},
                { targets: 1, title: "Client ID", data: "clientId"},           
            ],
            initComplete : function() {
                $('#datatable-profile_filter').detach().appendTo('#datatable-search-profile')
 
            },
        })
    }

    // <!-- Prescription --> //
    static async viewAddPrescForm(){
        $('#modal-add-presc').modal('show')

        MedsDB.getMeds()
            .then(meds => {
                $("#presc-select-med").prepend("<option value='' selected disabled hidden>Select Medication</option>").val('');
                meds.forEach(med => {
                    $("#select-med").append(new Option(`${med.name}`, med.id))
                })
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

        $('#form-client-add-carer').submit(function(event){
            event.preventDefault()
            ClientProfile.addConn()
        })

        $('#btn-client-add-conn').click(function(){
            ClientProfile.viewAddConnForm()
        })

        $('#btn-add-presc').click(function(){
            ClientProfile.viewAddPrescForm()
        })

        $('#form-add-conn').submit(function(){
            event.preventDefault()
            ClientProfile.addConn()
        })
    }
}