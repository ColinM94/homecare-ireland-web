class Clients{
    // Populates clients datatable and sets up listeners. 
    static async setupClients () {
        let clients = await ClientsDB.getClients()

        $('#datatable').DataTable( {
            data: clients,
            "lengthChange": false,
            paging: false,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatableSearch');
            },
            columns: [
                { title: "ID", data: "id", visible: false},
                { title: "Name", data: "name" },
                { title: "DOB", data: "dob"},
                { title: "Mobile", data: "mobile"},
                { title: "Address 1", data: "address1"},
                { title: "Address 2",data: "address2"},
                { title: "Town",data: "town"},
                { title: "County", data: "county"},
                { title: "Eircode", data: "eircode"},
                { title: "Marital Status", data: "marital"},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Clients.viewEditClientForm('${row.id}')">Edit</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Clients.confirmDeactivate('${row.id}')">Deactivate</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Clients.viewClientProfile('${row.id}')">View Profile</a>`
                }},
            ]
        })

        this.listeners()
    }

    // Opens modal and inserts values into edit client form. 
    static viewEditClientForm(clientId) {
        $('#modalEditClient').modal('show')

        ClientsDB.getClient(clientId).then(result => {
            $("#editClientId").val(clientId)
            $("#editClientName").val(result.name)
            $("#editClientDob").val(result.dob) 
            $("#editClientMobile").val(result.mobile) 
            $("#editClientAddress1").val(result.address1) 
            $("#editClientAddress2").val(result.address2) 
            $("#editClientTown").val(result.town) 
            $("#editClientCounty").val(result.county) 
            $("#editClientEircode").val(result.eircode) 
            $("#editClientMarital").val(result.marital) 
        })
    }

    // Displays selected client details. 
    static async viewClientProfile(clientId){
        $('#clientsList').hide()
        $('#clientProfile').show() 

        let client = await ClientsDB.getClient(clientId)

        $('#client-profile-id').text(` ${client.id}`)
        $('#clientProfileTitle').html(` ${client.name}'s Profile`)
        $('#clientProfileName').text(` ${client.name}`)
        $('#clientProfileMobile').text(` ${client.mobile}`)
        $('#clientProfileAddress').text(` ${client.address1}, ${client.address2}, ${client.town}, ${client.county}, ${client.eircode}`)
            
        this.loadConns(clientId)
    }

    // Opens add connection modal form. 
    static async viewAddConnForm(){
        $('#modal-add-connection').modal('show')

        // Clears list. 
        $('#select-user-list').empty()

        UsersDB.getUsers().then(users => {
            users.forEach(user => {
                $("#select-user-list").append(new Option(`${user.name} : ${user.id}`, user.id))
            })
        })

        $('#modal-add-connection').modal('hide')
    }

    // Gets and displays connections. 
    static async loadConns(clientId){
        // Clears client connections. 
        $("#client-connections").html("")

        let connections = await ConnsDB.getConns(clientId)

        if(connections != null){
            connections.forEach(userId => {
                UsersDB.getUser(userId).then(user => {
                    $("#client-connections").append(`${user.role}: <a href="${user.id}">${user.name}</a> <a href="javascript:Clients.confirmDeleteConn('${clientId}','${user.id}')" style="color:red;">[X]</a><br>`)
                })
            })
        }
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        let clients = await ClientsDB.getClients()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(clients)
        table.draw()
    }

    // Prompts user to confirm client deletion. 
    static confirmDeactivate(clientId){
        $('#modal-client-deactivate').modal('show')
        $('#idHolder').text(clientId)
    }

    // Prompts user to confirm connection deletion. 
    static confirmDeleteConn(clientId, userId){
        $('#modal-client-delete-conn').modal('show')
        $('#client-conn-clientidholder').text(clientId)
        $('#client-conn-useridholder').text(userId)
    }

    static async addClient(){
        let name = $("#addClientName").val()
        let dob = $("#addClientDob").val()
        let mobile = $("#addClientMobile").val()
        let address1 = $("#addClientAddress1").val()
        let address2 = $("#addClientAddress2").val()
        let town = $("#addClientTown").val()
        let county = $("#addClientCounty").val()
        let eircode = $("#addClientEircode").val()
        let marital = $("#addClientMarital").val()

        ClientsDB.addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#addClientModal').modal('hide')

        this.refreshTable()
    }

    static async editClient(){
        let id = $("#editClientId").val()
        let name = $("#editClientName").val()
        let dob = $("#editClientDob").val()
        let mobile = $("#editClientMobile").val()
        let address1 = $("#editClientAddress1").val()
        let address2 = $("#editClientAddress2").val()
        let town = $("#editClientTown").val()
        let county = $("#editClientCounty").val()
        let eircode = $("#editClientEircode").val()
        let marital = $("#editClientMarital").val()

        ClientsDB.updateClient(id, name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#modalEditClient').modal('hide')

        this.refreshTable()
    }

    static async addConn(){
        let clientId = $('#client-profile-id').text().replace(/\s/g, '')
        let userId = $('#select-user-list').val()
        await ConnsDB.addConn(userId, clientId)
        this.loadConns(clientId)
        $('#modal-add-connection').modal('hide')
    }

    static async deleteConn(){
        var clientId = $('#client-conn-clientidholder').text()
        var userId = $('#client-conn-useridholder').text()
        $('#modal-client-delete-conn').modal('hide')
        await ConnsDB.deleteConn(clientId, userId) 
        this.loadConns(clientId)
    }

    static async deactivateClient(){
        var clientId = $('#idHolder').text()
        $('#modal-client-deactivate').modal('hide')
        ClientsDB.deactivateClient(clientId)
        this.refreshTable()
    }

    // Instantiates listeners. 
    static async listeners() {
        $("#formAddClient").submit(function(event) {
            event.preventDefault()
            Clients.addClient()
        })

        $("#formEditClient").submit(function(event) {
            event.preventDefault()
            Clients.editClient()
        })

        $("#form-add-connection").submit(function(event) {
            event.preventDefault()
            Clients.addConn()
        })

        $('#btn-add-connection').click(function(){
            Clients.viewAddConnForm()
        })

        $('#btn-client-deactivate').click(function(){
            Clients.deactivateClient()
        })

        $('#btn-client-delete-conn').click(function(){
            Clients.deleteConn()
        })

        $('#btnCloseProfile').click(function(){
            $('#clientsList').show()
            $('#clientProfile').hide()
        })
    }
}



