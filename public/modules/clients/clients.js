class Clients{
    static overlay = false

    // Initialises and populates datatable. Sets up listeners. 
    static async load() {
        let clients = await ClientsDB.getClients()

        $('#datatable').DataTable( {
            data: clients,
            "lengthChange": false,
            "paging": false,
            "bFilter": true,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { "orderable": false, "targets": [11,12,13] }
            ],
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatable-search')

                this.api().columns([10,6,7,9]).every(function() {
                    var column = this

                    var select = $('<select class="form-select text-secondary mr-2 col"><option value="">No Filter</option></select>')
                        .appendTo($("#clients-filters-dropdown"))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val())                                 
                            column.search(val ? '^' + val + '$' : '', true, false).draw()
                        })

                    column.data().unique().sort().each(function (d, j) {
                        select.append('<option value="' + d + '">' + d + '</option>')
                    })    
                })
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
                { title: "Active", data: "active"},
                {mRender: function (data, type, row) {
                    if(row.active == true)
                        return `<a href="javascript:Clients.viewEditClientForm('${row.id}')">Edit</a>`
                    else
                        return `<a href="javascript:Clients.deleteClient('${row.id}')">Delete</a>`
                }},
                {mRender: function (data, type, row) {
                    if(row.active == true)
                        return `<a href="javascript:Clients.deactivateClient('${row.id}')">Deactivate</a>`
                    else
                        return `<a href="javascript:Clients.activateClient('${row.id}')">Activate</a>`
                }},
                {mRender: function (data, type, row) {

                        return `<a href="javascript:Module.load('ClientProfile', '${row.id}')"> View Profile</a>`

                }},
            ]
        })

        this.listeners()
    }

    // Opens modal and inserts values into edit client form. 
    static viewEditClientForm(clientId) {
        $('#modal-edit-client').modal('show')

        ClientsDB.getClient(clientId).then(client => {
            $("#edit-client-id").val(clientId)
            $("#edit-client-name").val(client.name)
            $("#edit-client-gender").val(client.gender)
            $("#edit-client-dob").val(client.dob) 
            $("#edit-client-mobile").val(client.mobile) 
            $("#edit-client-address1").val(client.address1) 
            $("#edit-client-address2").val(client.address2) 
            $("#edit-client-town").val(client.town) 
            $("#edit-client-county").val(client.county) 
            $("#edit-client-eircode").val(client.eircode) 
            $("#edit-client-marital").val(client.marital) 
        })
    }

    static async addClient(){
        let name = $("#add-client-name").val()
        let gender = $("#add-client-gender").val()
        let dob = $("#add-client-dob").val()
        let mobile = $("#add-client-mobile").val()
        let address1 = $("#add-client-address1").val()
        let address2 = $("#add-client-address2").val()
        let town = $("#add-client-town").val()
        let county = $("#add-client-county").val()
        let eircode = $("#add-client-eircode").val()
        let marital = $("#add-client-marital").val()
          
        if(!name){
            Notification.formError("Please enter a name!")
        }else if(!gender){
            Notification.formError("Please select a gender!")
        }else if(!dob){
            Notification.formError("Please select a date of birth!")
        }else if(!mobile){
            Notification.formError("Please enter a mobile number!")
        }else if(!address1){
            Notification.formError("Please enter an address!")
        }else if(!town){
            Notification.formError("Please enter a town!")
        }else if(!county){
            Notification.formError("Please enter a county!")
        }else if(!Validate.eircode(eircode)){
            Notification.formError("Invalid Eircode format!")
        }else if(!marital){
            Notification.formError("Please enter a marital status!")
        }else{
            Notification.formError("")
        }


        //ClientsDB.addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, true)

        //$('#modal-add-client').modal('hide')

        //this.refreshTable()
    }

    static async updateClient(){
        // jQuery 
        $("#client-form").submit(function(event) {
            let name = $("#client-name").val()
        })

        // JavaScript
        document.getElementById("client-form").addEventListener("submit", function() {
            let name = document.getElementById("client-name").value
        })

        let name = $("#edit-client-name").val()
        let dob = $("#edit-client-dob").val()
        let mobile = $("#edit-client-mobile").val()
        let address1 = $("#edit-client-address1").val()
        let address2 = $("#edit-client-address2").val()
        let town = $("#edit-client-town").val()
        let county = $("#edit-client-county").val()
        let eircode = $("#edit-client-eircode").val()
        let marital = $("#edit-client-marital").val()

        await ClientsDB.updateClient(id, name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#modalEditClient').modal('hide')

        this.refreshTable()
    }

    static async activateClient(clientId) {
        startLoad()
        ClientsDB.activateClient(clientId)
            .then(() => {
                Notification.display(1, "Client activated")
                this.refreshTable()
                endLoad()
            }).catch(error => {
                Notification.display(2, "Unable to activate client")
                endLoad()
            })
    }

    static async deactivateClient(clientId){
        if(await Prompt.confirm("This action will remove all staff, visits, and prescriptions from this client!")){
            startLoad()
            await Promise.all([
                ClientsDB.deactivateClient(clientId),
                VisitsDB.deleteVisits(clientId),
                ConnsDB.deleteConns(clientId)
            ]).then(() => {
                Notification.display(1, "Client deactivated")
                endLoad()
            }).catch(error => {
                console.log(error.message())
                Notification.display(2, "Unable to de-activate client")
                endLoad()
            })

            this.refreshTable()
        }
    }

    static async deleteClient(clientId){
        if(await Prompt.confirm("This action will permanently remove this client!")){
            await Promise.all([
                ClientsDB.deleteClient(clientId),
                ConnsDB.deleteConns(clientId),
                VisitsDB.deleteVisits(clientId)
            ]).then(() => {
                Notification.display(1, "Client deleted")
                this.refreshTable()
            }).catch(error => {
                console.log(error.message())
                Notification.display(2, "Unable to delete client")
            })
        }
    }

    static async openFilters(){
        Animate.rotate(180, '.btn-filter')

        $('#clients-filters').removeClass("d-none")
        $('#clients-filters').addClass("d-block")

        $('#icon-clients-filter').removeClass("fa-chevron-down")
        $('#icon-clients-filter').addClass("fa-chevron-up")
    }

    static async closeFilters(){
        Animate.rotate(180, '.btn-filter')

        $('#clients-filters').removeClass("d-block")
        $('#clients-filters').addClass("d-none")

        $('#icon-clients-filter').removeClass("fa-chevron-up")
        $('#icon-clients-filter').addClass("fa-chevron-down")
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        startLoad()
        ClientsDB.getClients()
            .then(clients => {
                // Reset filter dropdowns.
                $("select").each( function(){
                    $(this).val( $("#" + $(this).attr("id") + " option:first").val() );
                })
                
                Clients.closeFilters()
                
                let table = $('#datatable').DataTable()

                // Reset table filtering and data, then redraw with new data.  
                table
                .search( '' )
                .columns().search( '' )
                .draw()
                .clear() 
                .rows.add(clients)
                .draw()

                endLoad()
            }).catch(error => {
                endLoad()
                Notification.display(2, "Unable to load clients")
                console.log(error.message)
            })
    }

    // Instantiates listeners. 
    static async listeners() {
        $("#form-add-client").submit(function(event) {
            event.preventDefault()
            Clients.addClient()
        })

        $("#form-edit-client").submit(function(event) {
            event.preventDefault()
            Clients.editClient()
        })

        $('#btn-client-deactivate').click(function(){
            Clients.deactivateClient()
        })

        $('.btn-refresh').click(function(){
            Animate.rotate(360, '.btn-refresh-icon')
            Clients.refreshTable()
        })

        $('#btn-clients-filter').click(function(){

            // Show filters else hide filters.  
            if($('#clients-filters').hasClass("d-none")){
                Clients.openFilters()
            }else{
                Clients.closeFilters()
            }
        })

        // $('#clients-active-filter').on('change', function () {
        //     let table = $('#datatable').DataTable()
        //     table.columns(1).search( this.value ).draw();
        // } )
        // $('#clients-county-filter').on('change', function () {
        //     let table = $('#datatable').DataTable()
        //     table.columns(7).search( this.value ).draw();
        // } )
    }
}



