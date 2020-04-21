class ClientsModule{
    // callBack: class reference = Allows for calling functions in view class. 
    // div: string = Div id/class to load module into. 
    // showSearch: boolean = Show/hide search box. 
    // showAdd: boolean = Show/hide add button. 
    // title: string = Title of card.
    // userId: string = Show clients of this user.   
    constructor(callback, div, title, showSearch, showAdd, userId){
        this.div = div
        this.callback = callback
        this.userId = userId

        $(`${div}`).load("views/templates/datatable.html", () => {
            if(userId) $(`${this.div} #modal`).load("views/modals/add-conn.html")

            if(showSearch){
                $(`${div} #datatable-search`).removeClass("d-none")
                $(`${div} #btn-filters`).removeClass("d-none")
            } 

            if(showAdd) $(`${div} #btn-add`).removeClass("d-none")

            // Hides header if empty.
            if(!showAdd && !showSearch && title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")

            $(`${this.div} #title`).text(title)

            this.createClientForm()

            this.observe()

            this.listeners()
            Module.show(this.div)
        })
    }

    observe(){
        let query = db.collection(`clients`)
        
        if(this.userId) query = query.where('users', 'array-contains', this.userId)

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
                Notification.display(2, "Problem loading connections")
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

        let userId = this.userId

        console.log(clients)
        this.datatable = $(`${this.div} #datatable`).DataTable({
            data: clients,
            // bLengthChange: false,
            paging: false,
            filter: true,
            info: false,
            // responsive: false,
            // "scrollX": true,
            responsive: {
                details: false
            },
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { targets: 0, title: "Name", data: "name", responsivePriority: 1},
                { targets: 1, title: "Gender", data: "gender", responsivePriority: 3},
                { 
                    targets: 2, 
                    title: "DOB", 
                    responsivePriority: 4, 
                    render: function(data, type, row, meta){
                        return Convert.tsToDate(row.dob)
                    }  
                },
                { targets: 3, title: "Town", data: "town", responsivePriority: 5},
                { targets: 4, title: "County", data: "county", responsivePriority: 6},
                { 
                    targets: 5, 
                    visible: false,
                    data: function(data){
                        return data.archived ? "Yes" : "No"
                    }
                },
            ],
            initComplete : (ref) => {
                Table.filters(ref, this.div, [1,3,4,5], ["Gender", "Town", "County", "Archived"], true)
                Table.detachSearch(this.div)    
            },
        })

        // Filters out archived users by default. 
        this.datatable.column(5).search("No").draw()

        // Displays default filter. 
        $(`${this.div} #Archived-filter`).val("No")    
    }

    static async delete(userId, clientId){
        if(await Prompt.confirm("This action will archive client!")){
            ClientsDB.deactivateClient(clientId)
            .then(() => {
                console.log(Notification.display(1, "Client archived"))
            }).catch(error => {
                console.log(error.message)
                console.log(Notification.display(2, "Problem archiving client"))
            }) 
        }
    }

    static async deleteConn(userId, clientId){
        if(await Prompt.confirm("This action will remove assigned client from user!")){
            Promise.all([
                await ClientsDB.deleteConn(userId, clientId),
                await UsersDB.deleteConn(userId, clientId)
            ]).then(() => {
                console.log(Notification.display(1, "Connection deleted"))
                $('#modal-add-conn').modal('hide')
            }).catch(error => {
                console.log(error.message)
                console.log(Notification.display(2, "Problem deleting connection"))
            }) 
        }
    }

    createClientForm(){
        let formId = `#add-client`

        Module.createForm(this.div, formId, "New Client", "Add Client")
        
        Module.addField(formId, "text", "add-client-name", "Name")
        Module.addField(formId, "select", "add-client-gender", "Gender", {"Male":"Male", "Female":"Female"})
        Module.addField(formId, "date", "add-client-dob", "DOB")
        Module.addField(formId, "text", "add-client-mobile", "Mobile")
        Module.addField(formId, "select", "add-client-marital", "Marital Status", {"Married":"Married", "Widowed":"Widowed", "Not Married":"Not Married"})
        Module.addField(formId, "text", "add-client-address1", "Address 1")
        Module.addField(formId, "text", "add-client-address2", "Address 2")
        Module.addField(formId, "text", "add-client-town", "Town")
        Module.addField(formId, "select", "add-client-county", "County", 
        {"Carlow":"Carlow", "Cavan":"Cavan", "Clare":"Clare", "Cork":"Cork", "Donegal":"Donegal", "Dublin":"Dublin","Galway":"Galway", 
        "Kerry":"Kerry", "Kildare":"Kildare", "Kilkenny":"Kilkenny", "Laois":"Laois", "Leitrim":"Leitrim", "Limerick":"Limerick", 
        "Longford":"Longford", "Louth":"Louth", "Mayo":"Mayo", "Meath":"Meath", "Monaghan":"Monaghan", "Offaly":"Offaly", "Roscommon":"Roscommon", 
        "Sligo":"Sligo", "Tipperary":"Tipperary", "Waterford":"Waterford", "Westmeath":"Westmeath", "Wexford":"Wexford", "Wicklow":"Wexford"})
        Module.addField(formId, "text", "add-client-eircode", "Eircode")
    }

    addClient(){
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

        if(this.validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, marital)){
            ClientsDB.addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, false)
                .then(() => {
                    $('#add-client-modal').modal('hide')
                    Notification.display(2, "Client created")
                }).catch(error => {
                    console.log(error.message)
                    Notification.display(2, "Unable to add client")
                })
        }
    }
    
    // Validate add/edit client forms. 
    validateForm(name, gender, dob, mobile, address1, address2, town, county, eircode, marital){
        // Current datetime   
        var now = new Date()

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
        }else if(dob > now){
            Notification.formError("Date cannot be in the future!")
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

    async connForm(){
        $('#modal-add-conn').modal('show')

        $("#select-client")
            .empty()
            .append("<option value='' selected disabled hidden>Select Client</option>")
            .attr('disabled', false)

        $('#btn-add-conn').attr('disabled', false)

        let allClients

        allClients = await ClientsDB.getClients("active")

        allClients.forEach(client => {
            if(!client.users.includes(this.userId)){
                $("#select-client").append(new Option(`${client.name} : ${client.address1}, ${client.county}`, client.id))
            }
        })

        if($('#select-client option').length <= 1){
            $("#select-client")
                .empty()
                .append(new Option('No Clients Found!'))
                .attr('disabled', true)

            $('#btn-add-conn').attr('disabled', true)
        }

        $(this.div).on('click', `#btn-add-conn`, () => {
            this.addConn()
        })
    }

    async addConn(){
        let clientId = $('#select-client').val()

        if(!clientId){
            Notification.formError("Please select a client!")
        }else{
            Notification.formError("")

            await Promise.all([
                await ClientsDB.addConn(this.userId, clientId),
                await UsersDB.addConn(this.userId, clientId)
            ]).then(() => {
                Notification.display(1, "Connected created")
                $('#modal-add-conn').modal('hide')
            }).catch(error => {
                console.log(error.message)
                cNotification.display(2, "Problem creating connection")
            }) 
        }
    }

    listeners(){
        // Removes previously set listeners to prevent duplication. 
        $(this.div).off('click')

        // Toggles display of table filters. 
        $(this.div).on('click', `#btn-filters`, (ref) => {
            toggleFilters(this.div)
        })

        $(this.div).on('click', '#btn-add', (ref) => {
            if(this.userId)
                this.connForm()
            else
                $("#add-client-modal").modal("show")

        })

        $(this.div).on('click', '#btn-add-client', () => {
            this.addClient()
        })

        $(this.div).on('click', 'tr', (event) => {     
            if($(event.target).is("i")) return 
            
            let client = Table.rowClick(this.datatable, event)
            
            // Prevents loading module if table header row is clicked. 
            if(client != undefined){
                this.callback.handle(["client", client])
            }
        })
    }

    show(){
        $(this.div).show()
    }

    hide(){
        $(this.div).hide()
    }
}

