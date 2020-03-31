class ClientsModule{
    // div: string = Div id/class to load module into. 
    // title: string = Title of card.
    // userId: string = Show clients of this user.   
    // showSearch: boolean = Show/hide search box. 
    // showSearch: boolean = Show/hide add button. 
    constructor(div, title, showSearch, showAdd, userId){
        this.div = div

        $(`${div}`).load("views/templates/datatable.html", () => {
            $(`${div} #title`).text(title)

            if(!showSearch){
                $(`${div} #datatable-search`).hide()
                $(`${div} #btn-filters`).hide()
            } 
            if(!showAdd) $(`${div} #btn-add`).hide()
            
            this.observe(userId)
            this.listeners()
        })
    }

    async observe(userId){
        let query = db.collection('clients')

        if(userId != undefined){
            let conns = await ConnsDB.getConns(userId)

            let ids = new Array()
            conns.forEach(conn => {
                ids.push(conn.clientId)
            })

            if(ids.length != 0){
                query = query.where(firebase.firestore.FieldPath.documentId(), 'in', ids)
            }else{
                return
            }
        }

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

        // Module.scroll(this.div)
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
            ClientsDB.addClient(name, gender, dob, mobile, address1, address2, town, county, eircode, marital, true)
                .then(() => {
                    $('#modal-add-client').modal('hide')
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

    // Internal listeners
    listeners(){
        // Toggles display of table filters. 
        $(this.div).on('click', `#btn-filters`, (ref) => {
            toggleFilters(this.div)
        })

        $(this.div).on('click', '#btn-add', (ref) => {
            $('#modal-add-client').modal('show')
        })

        $("#modals").on('click', '#btn-add-client', () => {
            this.addClient()
        })
    }

    // External listeners
    listen(callback){
        $(this.div).on('click', 'tr', (ref) => {
            let client = Table.rowClick(this.datatable, ref)

            // Prevents loading module if table header row is clicked. 
            if(client != undefined){
                callback(["client", client])
            }
        })
    }
}






