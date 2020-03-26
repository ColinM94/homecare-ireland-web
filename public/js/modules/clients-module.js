class ClientsModule{
    constructor(div, userId, title){
        this.div = div
        this.showArchived = false
        this.userId = userId

        $(div).load("views/clients.html", () => {
            $(`${div} #content`).load("views/templates/datatable.html", () => {

                if(title != undefined) $(`${this.div} #title`).text(title)
                else $(`${this.div} #title`).text("Clients")

                this.loadData()
                this.listeners()
            })
        })
    }

    async loadData(){
        let query = db.collection('clients')

        if(this.userId != undefined){
            let conns = await ConnsDB.getConns(this.userId)

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
    }

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

    externalListeners(callback){
        $(this.div).on('click', 'tr', (ref) => {
            let client = Table.rowClick(this.datatable, ref)

            // Prevents loading module if table header row is clicked. 
            if(client != undefined){
                callback(["client", client])
            }
        })
    }
}






