class Clients{
    static overlay = false

    // Populates clients datatable and sets up listeners. 
    static async load() {
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
                    return `<a href="javascript:Clients.deactivateClient('${row.id}')">Deactivate</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Module.load('ClientProfile', '${row.id}')">View Profile</a>`
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


    // Resets and reloads datatable. 
    static async refreshTable(){
        let clients = await ClientsDB.getClients()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(clients)
        table.draw()
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

    static async deactivateClient(){
        if(await Prompts.confirm()){
            var clientId = $('#idHolder').text()
            ClientsDB.deactivateClient(clientId)
            this.refreshTable()
        }
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

        $('#btn-client-deactivate').click(function(){
            Clients.deactivateClient()
        })
    }
}



