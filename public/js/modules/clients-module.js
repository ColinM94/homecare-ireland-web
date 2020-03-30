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

            if(!showSearch) $(`${div} #datatable-search`).hide()
            if(!showAdd) $(`${div} #btn-add`).hide()
            
            this.observe()
            this.listeners()
        })
    }

    async observe(){
        let query = db.collection('clients')

        if(this.conn != undefined){
            let conns = await ConnsDB.getConns(this.conn)

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
    
    // Internal listeners
    listeners(){
        // Toggles display of table filters. 
        $(this.div).on('click', `#btn-filters`, (ref) => {
            console.log("click")
            toggleFilters(this.div)
        })

        // Switches between showing archived and non archived clients. 
        $(this.div).on('click', '#checkbox-archived', (ref) => {
            if(ref.target.checked) this.showArchived = true
            else this.showArchived = false

            this.loadData()
        })

        $(this.div).on('click', '#btn-add', (ref) => {
            $('#modal-add-client').modal('show')
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






