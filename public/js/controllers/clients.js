class Clients{
    constructor(div, title, conn){
        this.div = div
        this.showArchived = false
        this.conn = conn

        $(div).load("views/datatable.html")

        this.loadData()
        this.listeners()
    }

    async loadData(){
        let query = db.collection('clients')

        if(this.conn != undefined){
            let conns = await ConnsDB.getConns(this.conn)

            let ids = new Array()
            conns.forEach(conn => {
                ids.push(conn.clientId)
            })

            if(ids.length > 0){
                query = query.where(firebase.firestore.FieldPath.documentId(), 'in', ids)
            }else{
                return
            }
        }

        if(this.showArchived) query = query.where('archived', '==', true)
        else if(this.showArchived) query = query.where('archived', '==', false)

        // if(this.userId != null){

            // console.log(conns)
                // console.log(this.userId)
            // conns.forEach(conn => {
                // console.log(conn.clientId)
                // query = query.where('id', '==', conn.clientId)

            // })
        // }

        query.onSnapshot(querySnapshot => {
                let clients = new Array()

                querySnapshot.forEach(doc => {
                    let client = new ClientModel()
                    client.docToClient(doc)
                    clients.push(client)
                })

                this.loadTable(clients)

            }, err => {
                console.log(`Encountered error: ${err}`)
                Notification.display(2, "Problem loading staff")
        })
    }

    loadTable(clients){
        if(this.datatable){
            this.datatable
                .clear()
                .rows.add(clients)
                .draw()

            return
        }
          
        this.datatable = $(`${this.div} #datatable`).DataTable({
            data: clients,
            // bLengthChange: false,
            paging: false,
            filter: true,
            info: false,
            responsive: {
                details: false
            },
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { 
                    targets: 0, 
                    title: "Name", 
                    data: "name", 
                    responsivePriority: 1
                },
                { targets: 1, title: "Gender", data: "gender", responsivePriority: 2},
                { targets: 2, title: "Town", data: "town", responsivePriority: 3},
                { targets: 3, title: "County", data: "county", responsivePriority: 4},
                { targets: 4, data: "archived", visible: false},
            ],
            initComplete : (ref) => {
                Table.filters(ref, this.div, [1,2,3], ["Gender", "Town", "County"], true)
                Table.detachSearch(this.div)    
            },
        })

                $(`${this.div} #title`).text("Clients")

    }

    listeners(){
        // Toggles display of table filters. 
        $(this.div).on('click', '#btn-filters', (ref) => {
            toggleFilters(this.div)
        })

        // Switches between showing archived and non archived clients. 
        $(this.div).on('click', '#checkbox-archived', (ref) => {
            if(ref.target.checked) this.showArchived = true
            else this.showArchived = false

            this.loadData()
        })
    }
}


// class Clients{
//     static async load() {
//         ClientsDB.observe()
//     }

//     static async initialise(clients){
//         $('#clients-datatable').DataTable( {
//             data: clients,
//             lengthChange: false,
//             paging: false,
//             bFilter: true,
//             "responsive": true,
//             oLanguage: {
//                 sLengthMenu: "_MENU_",
//                 sSearch: '', searchPlaceholder: "Search..." 
//             },
//             columnDefs: [
//                 { 
//                     targets: 0, 
//                     data: "active",
//                     title: "Active",
//                     render: function(data, type, row, meta){
//                         return data ? 
//                         `<button id="btn-deactivate-client" value="'${row.id}'" title="Deactivate Client">
//                             <i class="far fa-check-square fa-lg">
//                             <span class="d-none">true</span></i>
//                         </button>` : 
//                         `<button id="btn-activate-client" value="'${row.id}'" title="Activate Client">
//                             <i class="far fa-square fa-lg">
//                             <span class="d-none">false</span></i>
//                         </button>`
//                     }
//                 },
//                 { targets: 1, title: "Name", data: "name"},
//                 { targets: 2, title: "DOB", data: "dob"},
//                 { targets: 3, title: "Town", data: "town"},
//                 { targets: 4, title: "Marital", data: "marital"},
//                 { targets: 5, title: "County", data: "county"},
//                 {
//                     targets: 6, 
//                     title: "Profile",
//                     orderable: false,
//                     render: function(data, type, row, meta){
//                         return `<a href="javascript:loadClient('${row.id}')" title="View Client Profile"><i class="fa fa-user fa-lg"></a>`
//                     }           
//                 },
//                 {
//                     targets: 7, 
//                     title: "Edit", 
//                     orderable: false,
//                     render: function(data, type, row, meta){
//                         return `<a href="javascript:Clients.viewEditClientForm('${row.id}')" title="Edit Client Details"><i class="fa fa-user-edit fa-lg"></a>`
//                     }   
//                 },
//                 {
//                     targets: 8,
//                     title: "Delete",
//                     orderable: false,
//                     render: function(data, type, row, meta){
//                         return `<a href="javascript:Clients.deleteClient('${row.id}')" title="Delete Client"><i class="fa fa-times fa-lg"></i></a>`
//                     }   
//                 }            
//             ],
//             initComplete : function() {
//                 $("#clients-datatable_filter").detach().appendTo('#clients-search')

//                 this.api().columns([0,3,5,4]).every(function() {
//                     var column = this
//                     var select = $('<select class="form-control mr-2 col"><option value="">None</option></select>')
//                         .appendTo($("#clients-filters-dropdown"))
//                         .on('change', function () {
//                             var val = $.fn.dataTable.util.escapeRegex($(this).val())   
                        
//                             column.search(val ? '^' + val + '$' : '', true, false).draw()
//                         })

//                     column.data().unique().sort().each(function (d, j) {
//                         select.append('<option value="' + d + '">' + d + '</option>')
//                     })    
//                 })
//             },
//         })

//         this.listeners()
//     }

//     // Resets and reloads datatable. 
//     static async refreshTable(clients){
//         startLoad()
        
//         if(!$('#clients-datatable').text().trim()){
//             await this.initialise(clients)
//         }else{    
//             let table = $('#clients-datatable').DataTable()

//             table.clear() 
//                 table.rows.add(clients)
//                 table.draw()
//         }
   
//         endLoad()
//     }

//     // Opens modal and inserts values into edit client form. 
//     static viewEditClientForm(clientId) { 
//         Notification.formError("")
  
//         startLoad()  

//         ClientsDB.getClient(clientId)
//             .then(client => {
//                 $('#modal-edit-client').modal('show')

//                 $("#edit-client-id").val(clientId)
//                 $("#edit-client-name").val(client.name)
//                 $("#edit-client-gender").val(client.gender)
//                 $("#edit-client-dob").val(client.dob) 
//                 $("#edit-client-mobile").val(client.mobile) 
//                 $("#edit-client-address1").val(client.address1) 
//                 $("#edit-client-address2").val(client.address2) 
//                 $("#edit-client-town").val(client.town) 
//                 $("#edit-client-county").val(client.county) 
//                 $("#edit-client-eircode").val(client.eircode) 
//                 $("#edit-client-marital").val(client.marital) 
            
//                 endLoad()
//         }).catch(error => {
//             console.log(error.message)
//             Notification.display(2, "Unable to load client details")
//             endLoad()
//         })
//     }

//     static viewAddClientForm(){
//         $('#modal-add-client').modal("show")
//     }

//     static async addClient(){
//         let name = $("#add-client-name").val()
//         let gender = $("#add-client-gender").val()
//         let dob = new Date($("#add-client-dob").val())
//         let mobile = $("#add-client-mobile").val()
//         let address1 = $("#add-client-address1").val()
//         let address2 = $("#add-client-address2").val()
//         let town = $("#add-client-town").val()
//         let county = $("#add-client-county").val()
//         let eircode = $("#add-client-eircode").val()
//         let marital = $("#add-client-marital").val()

//         if(this.validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, marital)){
//             ClientsDB.addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, true)
//                 .then(() => {

//                 }).catch(error => {
//                     console.log(error.message)
//                     Notification.display(2, "Unable to add client")
//                 })

//             $('#modal-add-client').modal('hide')
//             this.refreshTable()
//         }
//     }

//     static async updateClient(){
//         let id = $("#edit-client-id").val()
//         let name = $("#edit-client-name").val()
//         let gender = $("#edit-client-gender").val()
//         let dob = new Date($("#edit-client-dob").val())
//         let mobile = $("#edit-client-mobile").val()
//         let address1 = $("#edit-client-address1").val()
//         let address2 = $("#edit-client-address2").val()
//         let town = $("#edit-client-town").val()
//         let county = $("#edit-client-county").val()
//         let eircode = $("#edit-client-eircode").val()
//         let marital = $("#edit-client-marital").val()

//         if(this.validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, marital)){
//             startLoad()
//             ClientsDB.updateClient(id, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, true)
//                 .then(() => {
//                     Notification.display(1, "Client Updated")
//                     endLoad()
//                     $('#modal-edit-client').modal('hide')
//                 }).catch(error => {
//                     console.log(error.message)
//                     Notification.display(2, "Error Updating Client")
//                     endLoad()
//                     $('#modal-edit-client').modal('hide')
//                 })
//         }

//     }

//     // Validate add/edit client forms. 
//     static validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, marital){
//         // Form validation.
//         if(!name){
//             Notification.formError("Please enter a name!")
//         }else if(name.length > 30){
//             Notification.formError("Name must be 50 characters or less!")
//         }
 
//         else if(!gender){
//             console.log(gender)
//             Notification.formError("Please select a gender!")
//         }
        
//         else if(!Date.parse(dob)){
//             Notification.formError("Please select a date of birth!")
//         }else if(dob.getFullYear() < 1900){
//             Notification.formError("Invalid Year!")
//         }
        
//         else if(!mobile){
//             Notification.formError("Please enter a mobile number!")
//         }else if(!Validate.mobile(mobile)){
//             Notification.formError("Invalid mobile format!")
//         }
        
//         else if(!address1){
//             Notification.formError("Please enter an address!")
//         }else if(address1.length > 30){
//             Notification.formError("Address 1 must be 30 characters or less!")
//         }

//         else if(address2.length > 30){
//             Notification.formError("Address 2 must be 30 characters or less!")
//         }
        
//         else if(!town){
//             Notification.formError("Please enter a town!")
//         }else if(town.length > 30){
//             Notification.formError("Town must be 30 characters or less!")
//         }
        
//         else if(!county){
//             Notification.formError("Please enter a county!")
//         }else if(county.length > 30){
//             Notification.formError("County must be 30 characters or less!")
//         }
        
//         else if(!eircode){
//             Notification.formError("Please enter an Eircode!")
//         }else if(!Validate.eircode(eircode)){
//             Notification.formError("Invalid Eircode format!")
//         }
        
//         else if(!marital){
//             Notification.formError("Please enter a marital status!")
//         }

//         else{
//             Notification.formError("")
//             return true
//         }
//     }

//     static async activateClient(clientId) {
//         // startLoad()
//         await ClientsDB.activateClient(clientId)
//             .then(() => {
//                 Notification.display(1, "Client activated")
//                 endLoad()
//             }).catch(error => {
//                 Notification.display(2, "Unable to activate client")
//                 endLoad()
//             })

//         return false
//     }

//     static async deactivateClient(clientId){
//         if(await Prompt.confirm("This action will remove all staff, visits, and prescriptions from this client!")){
//             // startLoad()
//             await Promise.all([
//                 ClientsDB.deactivateClient(clientId),
//                 VisitsDB.deleteVisits(clientId),
//                 ConnsDB.deleteConns(clientId)
//             ]).then(() => {
//                 Notification.display(1, "Client deactivated")
//                 endLoad()
//             }).catch(error => {
//                 console.log(error.message())
//                 Notification.display(2, "Unable to de-activate client")
//                 endLoad()
//             })
//         }
//     }

//     static async deleteClient(clientId){
//         if(await Prompt.confirm("This action will permanently remove this client!")){
//             await Promise.all([
//                 ClientsDB.deleteClient(clientId),
//                 ConnsDB.deleteConns(clientId),
//                 VisitsDB.deleteVisits(clientId)
//             ]).then(() => {
//                 Notification.display(1, "Client deleted")
//             }).catch(error => {
//                 console.log(error.message())
//                 Notification.display(2, "Unable to delete client")
//             })
//         }
//     }

//     static async openFilters(){
//         Animate.rotate(180, '.btn-filter')

//         $('#clients-filters').removeClass("d-none")
//         $('#clients-filters').addClass("d-block")

//         $('#icon-clients-filter').removeClass("fa-chevron-down")
//         $('#icon-clients-filter').addClass("fa-chevron-up")
//     }

//     static async closeFilters(){
//         Animate.rotate(180, '.btn-filter')

//         $('#clients-filters').removeClass("d-block")
//         $('#clients-filters').addClass("d-none")

//         $('#icon-clients-filter').removeClass("fa-chevron-up")
//         $('#icon-clients-filter').addClass("fa-chevron-down")
//     }

//     // Instantiates listeners. 
//     static async listeners() {
//         $("#form-add-client").submit(function(event) {
//             event.preventDefault()
//             Clients.addClient()
//         })

//         $("#form-edit-client").submit(function(event) {
//             event.preventDefault()
//             Clients.updateClient()
//         })

//         $('.btn-refresh').on('click touchstart', function(){
//             Animate.rotate(360, '.btn-refresh-icon')
//             Clients.refreshTable()
//         })

//         $('#btn-add-client').on('click touchstart', function(){
//             Clients.viewAddClientForm()
//         })

//         $('#btn-clients-filter').on('click touchstart', function(){
//             // Show filters else hide filters.  
//             if($('#clients-filters').hasClass("d-none")){
//                 Clients.openFilters()
//             }else{
//                 Clients.closeFilters()
//             }
//         })

//         $('input[type="checkbox"]').on('click touchstart', function(e){
//             e.preventDefault();
//         })

//         $('#btn-activate-client').on('click touchstart', function(){
//             console.log(this.value)
//         })

//         $('#btn-activate-client').on('click touchstart', function(){
            
//         })
//     }
// }



