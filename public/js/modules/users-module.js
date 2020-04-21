class UsersModule{ 
    // div: string = Div id/class to load module into. 
    // title: string = Title of card. 
    // showSearch: boolean = Show/hide search box. 
    // callBack: class reference = Allows for calling functions in view class. 
    constructor(callback, div, title, showSearch, showAdd){
        this.div = div
        this.callback = callback

        $(`${div}`).load('views/templates/datatable.html', () => {
            if(showSearch){
                $(`${div} #datatable-search`).removeClass("d-none")
                $(`${div} #btn-filters`).removeClass("d-none")
            }
            
            if(showAdd) $(`${div} #btn-add`).removeClass("d-none")
            
            $(`${div} #title`).text(title)

            Module.show(div)
            this.observe() 
            this.listeners()
        })
    }

    // Watches for changes in db and auto updates table. 
    observe(){
        let query = db.collection('users')

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
                { targets: 1, title: "Role", data: "role", responsivePriority: 2},
                { targets: 2, title: "Gender", data: "gender", responsivePriority: 3},
                { targets: 3, title: "Town", data: "town", responsivePriority: 4},
                { targets: 4, title: "County", data: "county", responsivePriority: 5},
                { 
                    targets: 5, 
                    visible: false,
                    data: function(data){
                        return data.archived ? "Yes" : "No"
                    }
                },
            ],
            initComplete : (ref) => {
                Table.filters(ref, this.div, [1,2,3,4,5], ["Role", "Gender", "Town", "County", "Archived"], true)
                Table.detachSearch(this.div)    
            },
        })
        
        // Filters out archived users by default. 
        this.datatable.column(5).search("No").draw()

        // Displays default filter. 
        $(`${this.div} #Archived-filter`).val("No")    
    }

    listeners(div){
        // Toggles display of table filters. 
        $(this.div).on('click', '#btn-filters', (ref) => {
            toggleFilters(this.div)
        })

         $(this.div).on('click', 'tr', (ref) => {
            let user = Table.rowClick(this.datatable, ref)

            // Prevents loading module if table header row is clicked. 
            if(user != undefined){
                this.callback.handle(["user", user])
            }
        })
    }
}
