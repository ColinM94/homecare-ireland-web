class ClientsDeactive{
    overlay = false
    // Requires that client module is loaded first. 
    static async load() {
        let clients = await ClientsDB.getDeactiveClients()

        $('#datatable').DataTable({
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
                    return `<a href="javascript:ClientsDeactive.activateClient('${row.id}')">Activate</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:ClientsDeactive.deleteClient('${row.id}')">Delete</a>`
                }},
            ]
        })

        this.listeners()
    }

    static async activateClient(clientId) {
        await ClientsDB.activateClient(clientId)
        this.refreshTable()
    }

    static async deleteClient(clientId){
        if(await Prompt.confirm()){
            ClientsDB.deleteClient(clientId)
            ConnsDB.deleteConns(clientId)
            VisitsDB.deleteVisits(clientId)
        }

        this.refreshTable()
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        let clients = await ClientsDB.getDeactiveClients()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(clients)
        table.draw()
    }

    // Instantiates listeners.
    static listeners(){
        $('#btn-clientsdeactive-delete').click(function(event) {
            event.preventDefault()

            ClientsDeactive.deleteClient()
        })
    }
}
