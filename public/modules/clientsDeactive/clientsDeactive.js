class ClientsDeactive{
    // Requires that client module is loaded first. 
    static async setupClientsDeactive() {
        let clients = await ClientsDB.getClientsDeactive()

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
                    return `<a href="javascript:ClientsDeactive.confirmDeleteClient('${row.id}')">Delete</a>`
                }},
            ]
        })

        this.listeners()
    }

    static activateClient(clientId) {
        ClientsDB.activateClient(clientId)
        this.refreshTable()
    }

    static confirmDeleteClient(clientId) {
        $('#modal-client-delete').modal('show')
        $('#client-deactive-idholder').text(clientId)
    }

    static async deleteClient(){
        let clientId = $('#client-deactive-idholder').text()
        await ClientsDB.deleteClient(clientId)
        $('#modal-client-delete').modal('hide')
        this.refreshTable()
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        let clients = await ClientsDB.getClientsDeactive()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(clients)
        table.draw()
    }

    // Instantiates listeners.
    static listeners(){
        $('#btn-clientsdeactive-delete').click(function(event) {
            event.preventDefault()

            this.deleteClient()
        })
    }
}
