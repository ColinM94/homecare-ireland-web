class Clients{
    static overlay = false

    // Initialises and populates datatable. Sets up listeners. 
    static async load() {
        let clients = await ClientsDB.getClients()

        $('#datatable').DataTable( {
            data: clients,
            lengthChange: false,
            paging: false,
            bFilter: true,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { 
                    targets: 0, 
                    data: "active",
                    title: "Active",
                    render: function(data, type, row, meta){
                        return data ? `<a href="javascript:Clients.deactivateClient('${row.id}')" title="Deactivate Client"><i class="far fa-check-square fa-lg"><span class="d-none">true</span></i></a>` : `<a href="javascript:Clients.activateClient('${row.id}')" title="Activate Client"><i class="far fa-square fa-lg"><span class="d-none">false</span></i></a>`
                    }
                },
                { targets: 1, title: "Name", data: "name"},
                { targets: 2, title: "DOB", data: "dob"},
                { targets: 3, title: "Town", data: "town"},
                { targets: 4, title: "Marital", data: "marital"},
                { targets: 5, title: "County", data: "county"},
                {
                    targets: 6, 
                    title: "Profile",
                    orderable: false,
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Module.load('ClientProfile', '${row.id}')" title="View Client Profile"><i class="fa fa-user fa-lg"></a>`
                    }           
                },
                {
                    targets: 7, 
                    title: "Edit", 
                    orderable: false,
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Clients.viewEditClientForm('${row.id}')" title="Edit Client Details"><i class="fa fa-user-edit fa-lg"></a>`
                    }   
                },
                {
                    targets: 8,
                    title: "Delete",
                    orderable: false,
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Clients.deleteClient('${row.id}')" title="Delete Client"><i class="fa fa-times fa-lg"></i></a>`
                    }   
                }            
            ],
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatable-search')

                this.api().columns([0,3,5,4]).every(function() {
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

    static viewAddClientForm(){
        $('#modal-add-client').modal("show")
    }

    static async addClient(){
        let name = $("#add-client-name").val()
        let gender = $("#add-client-gender").val()
        let dob = new Date($("#add-client-dob").val())
        let mobile = $("#add-client-mobile").val()
        let address1 = $("#add-client-address1").val()
        let address2 = $("#add-client-address2").val()
        let town = $("#add-client-town").val()
        let county = $("#add-client-county").val()
        let eircode = $("#add-client-eircode").val()
        let marital = $("#add-client-marital").val()

        if(this.validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, mobile, marital)){
            ClientsDB.addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, true)
                .then(() => {

                }).catch(error => {
                    console.log(error.message)
                    Notification.display(2, "Unable to add client")
                })

            $('#modal-add-client').modal('hide')
            this.refreshTable()
        }
    }

    static async updateClient(){
        let id = $("#edit-client-id").val()
        let name = $("#edit-client-name").val()
        let gender = $("#edit-client-gender").val()
        let dob = new Date($("#edit-client-dob").val())
        let mobile = $("#edit-client-mobile").val()
        let address1 = $("#edit-client-address1").val()
        let address2 = $("#edit-client-address2").val()
        let town = $("#edit-client-town").val()
        let county = $("#edit-client-county").val()
        let eircode = $("#edit-client-eircode").val()
        let marital = $("#edit-client-marital").val()

        if(this.validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, mobile, marital)){
            startLoad()
            ClientsDB.updateClient(id, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, true)
                .then(() => {
                    Notification.display(1, "Client Updated")
                    this.refreshTable()
                    endLoad()
                }).catch(error => {
                    startLoad()
                    console.log(error.message)
                    Notification.display(2, "Error Updating Client")
                })
        }

        $('#modal-edit-client').modal('hide')
    }

    // Validate add/edit client forms. 
    static validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, marital){
        // Form validation.
        if(!name){
            Notification.formError("Please enter a name!")
        }else if(name.length > 30){
            Notification.formError("Name must be 50 characters or less!")
        }
 
        else if(!gender){
            Notification.formError("Please select a gender!")
        }
        
        else if(!Date.parse(dob)){
            Notification.formError("Please select a date of birth!")
        }else if(dob.getFullYear() < 1900){
            Notification.formError("Invalid Year!")
        }
        
        else if(!Validate.mobile(mobile)){
            Notification.formError("Invalid mobile format!")
        }
        
        else if(!address1){
            Notification.formError("Please enter an address!")
        }else if(address1.length > 30){
            Notification.formError("Address 1 must be 30 characters or less!")
        }

        else if(address2.length > 30){
            Notification.formError("Address 2 must be 30 characters or less!")
        }
        
        else if(!town){
            Notification.formError("Please enter a town!")
        }else if(town.length > 30){
            Notification.formError("Town must be 30 characters or less!")
        }
        
        else if(!county){
            Notification.formError("Please enter a county!")
        }else if(county.length > 30){
            Notification.formError("County must be 30 characters or less!")
        }
        
        else if(!Validate.eircode(eircode)){
            Notification.formError("Invalid Eircode format!")
        }
        
        else if(!marital){
            Notification.formError("Please enter a marital status!")
        }

        else{
            Notification.formError("")
            return true
        }
    }

    static async activateClient(clientId) {
        startLoad()
        await ClientsDB.activateClient(clientId)
            .then(() => {
                Notification.display(1, "Client activated")
                this.refreshTable()
                endLoad()
            }).catch(error => {
                Notification.display(2, "Unable to activate client")
                endLoad()
            })

        return false
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
                let table = $('#datatable').DataTable()
                table
                    .clear()
                    .rows.add(clients)
                    .draw()


                //Reload Data


                //Reload everything
                // Reset filter dropdowns.
                // $("select").each( function(){
                //     $(this).val( $("#" + $(this).attr("id") + " option:first").val() );
                // })
                
                // Clients.closeFilters()
                
                // 

                // // Reset table filtering and data, then redraw with new data.  
                // table
                // .search( '' )
                // .columns().search( '' )
                // .clear() 
                // .rows.add(clients)
                // .draw()

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
            console.log("Update client")
            Clients.updateClient()
        })

        $('.btn-refresh').click(function(){
            Animate.rotate(360, '.btn-refresh-icon')
            Clients.refreshTable()
        })

        $('#btn-add-client').click(function(){
            Clients.viewAddClientForm()
        })

        $('#btn-clients-filter').click(function(){
            // Show filters else hide filters.  
            if($('#clients-filters').hasClass("d-none")){
                Clients.openFilters()
            }else{
                Clients.closeFilters()
            }
        })

        $('input[type="checkbox"]').click(function(e){
            e.preventDefault();
        })

    }
}



