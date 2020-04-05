class VisitsModule{
    // callBack: class reference = Allows for calling functions in view class. 
    // div: string = Div id/class to load module into. 
    // showSearch: boolean = Show/hide search box. 
    // showAdd: boolean = Show/hide add button. 
    // title: string = Title of card.
    // userId: string = Show clients of this user.   
    constructor(callback, div, title, showSearch, showAdd, id){
        this.div = div
        this.callback = callback
        this.id = id
            
        $(`${div}`).load("views/templates/datatable.html", () => {
            if(id.length < 20) $(`${this.div} #modal`).load("views/modals/add-visit.html")

            if(showSearch){
                $(`${div} #datatable-search`).removeClass("d-none")
                $(`${div} #btn-filters`).removeClass("d-none")
            } 

            if(showAdd) $(`${div} #btn-add`).removeClass("d-none")

            // Hides header if empty.
            if(!showAdd && !showSearch && title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")

            $(`${this.div} #title`).text(title)

            this.observe()

            this.listeners()
            Module.show(this.div)
        })

    }

    observe(){
        let query = db.collection(`visits`)

        if(this.id.length > 20) query = query.where('userId', '==', this.id)
        else query = query.where('clientId', '==', this.id)

        query.onSnapshot(querySnapshot => {
                let visits = new Array()
                querySnapshot.forEach(doc => {
                    let visit = new VisitModel()
                    visit.docToVisit(doc)
                    visits.push(visit)
                })

                this.loadTable(visits)

            }, err => {
                console.log(`Encountered error: ${err}`)
                Notification.display(2, "Problem loading connections")
        })
    }

    // let client = await ClientsDB.getClient(visit.clientId)

    loadTable(visits){
        if(this.datatable){
            this.datatable
                .clear()
                .rows.add(visits)
                .draw()

            return
        }

        this.datatable = $(`${this.div} #datatable`).DataTable({
            data: visits,
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
                    title: "Start Date", 
                    responsivePriority: 1,
                    render: function(data, type, row, meta){
                        return Convert.tsToDate(row.start)
                    }  
                },
                { 
                    targets: 1, 
                    title: "Start Time", 
                    responsivePriority: 1,
                    orderable: false,
                    render: function(data, type, row, meta){
                        return Convert.tsToTime(row.start)
                    }  
                },
                { 
                    targets: 2, 
                    title: "Client", 
                    responsivePriority: 1,
                    render: function(data, type, row, meta){
                        return Convert.tsToDate(row.end)
                    }  
                },
                // { 
                //     targets: 3, 
                //     title: "End Time", 
                //     responsivePriority: 1,
                //     render: function(data, type, row, meta){
                //         return Convert.tsToTime(row.end)
                //     }  
                // },
            ],
            initComplete : (ref) => {
                // Table.filters(ref, this.div, [1,2,3, 4], ["Gender", "Town", "County", "Archived"], true)
                Table.detachSearch(this.div)    
            },
        })

        // Module.scroll(this.div)
    } 

    // <-- VISITS --> //
    async visitForm(){
        $('#modal-add-visit').modal('show')

        $('#visit-select-user').empty()

        UsersDB.getUsers("active", "carers").then(clients => {
            $("#visit-select-user").prepend("<option value='' selected disabled hidden>Select Carer</option>").val('')

            // Add carers connected to this client to dropdown list.
            clients.forEach(client => {
                $("#visit-select-user").append(new Option(`${client.name} : ${client.address1}`, client.id))
            })
        })

        // $('#modal-visit-add').modal('hide')
    }

    async addVisit(){
        let userId = $('#visit-select-user').val()
        let start = new Date($('#visit-start').val())
        let end = new Date($('#visit-end').val())
        let notes = $('#visit-notes').val()

        if(!userId){
            Notification.formError("Please select a carer!")
        }else if(!start){
            Notification.formError("Please select a start date!")
        }else if(Date.now() > start){
            Notification.formError("New visits cannot take place in the past!")
        }else if(!end){
            Notification.formError("Please select an end date!")
        }else if(start > end){
            Notification.formError("The visit cannot end before it starts!")
        }else{
            Notification.formError("")
        
        let n = notes.split("\n")
        console.log(n)
            await VisitsDB.addVisit(userId, this.clientId, start, end, n)
                .then(() => {
                    $('#modal-add-visit').modal('hide')
                }).catch(error => {
                    Notification.display(2, "Failed to add visit")
                    console.log(error.message)
                })
        }     
    }

    listeners(){
        $(this.div).on('click', '#btn-add', (ref) => {
            this.visitForm()
        })

        $(this.div).on('click', '#btn-add-visit', (ref) => {
            this.addVisit()
        })

        $(this.div).on('click', 'tr', (event) => {
            
            if($(event.target).is("i")) return 
            
            let visit = Table.rowClick(this.datatable, event)

            // Prevents loading module if table header row is clicked. 
            if(visit != undefined){
                this.callback.handle(["visit", visit])
            }
        })
    }
}