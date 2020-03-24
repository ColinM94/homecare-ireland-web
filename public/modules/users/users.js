class Users{ 
    constructor(div){
        this.div = div

        $(`${this.div}`).load('views/datatable.html', () => {
            this.loadData()
            this.listeners()
        })
    }

    // Watches for changes in db and auto updates table. 
    loadData(){
        let query 

        if(this.showArchived) query = db.collection('users').where('archived', '==', true)
        else query = db.collection('users').where('archived', '==', false)

        query.onSnapshot(querySnapshot => {
                let users = new Array()

                querySnapshot.forEach(doc => {
                    let user = new UserModel()
                    user.docToUser(doc)
                    users.push(user)
                })

                this.loadTable(users)

            }, err => {
                console.log(`Encountered error: ${err}`)
                Notification.display(2, "Problem loading staff")
        })
    }

    loadTable(users){
        // let table = "#users-container #datatable"

        if(this.datatable){
            this.datatable
                .clear()
                .rows.add(users)
                .draw()

            return
        }
          
        this.datatable = $(`${this.div} #datatable`).DataTable({
            data: users,
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
                { targets: 1, title: "Role", data: "role", responsivePriority: 2},
                { targets: 2, title: "Gender", data: "gender", responsivePriority: 3},
                { targets: 3, title: "Town", data: "town", responsivePriority: 4},
                { targets: 4, title: "County", data: "county", responsivePriority: 5},
                { targets: 5, data: "archived", visible: false},
            ],
            initComplete : (ref) => {
                Table.filters(ref, this.div, [1,2,3,4], ["Role", "Gender", "Town", "County"], true)
                Table.detachSearch(this.div)    
            },
        })
    }

    listeners(div){
        // Toggles display of table filters. 
        $(this.div).on('click', '#btn-filters', (ref) => {
            toggleFilters(this.div)
        })

        // Switches between showing archived and non archived users. 
        $(this.div).on('click', '#checkbox-archived', (ref) => {
            document.dispatchEvent(ref)
            if(ref.target.checked) this.showArchived = true
            else this.showArchived = false

            this.loadData()
        })
    }

    externalListeners(callback){
        return $(this.div).on('click', 'tr', (ref) => {
            let id = Table.rowClick(this.datatable, ref)

            // Prevents loading module if table header row is clicked. 
            if(id != undefined){
                callback(id)
            }
        })
    }
}
