class Users{
    static async load(){
        let query = db.collection('users')

        query.onSnapshot(querySnapshot => {
                let users = new Array()

                querySnapshot.forEach(doc => {
                    let user = new User()
                    user.docToUser(doc)
                    users.push(user)
                    Users.refreshTable(users)
                })
            }, err => {
                console.log(`Encountered error: ${err}`)
                Notification(2, "Problem loading staff")
        })

    }

    static async initialise(users){ 
        $('#users-datatable').DataTable({
            data: users,
            lengthChange: false,
            paging: false,
            bFilter: true,
            responsive: {
                // details: false
            },
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { 
                    targets: 0, 
                    title: "Active", 
                    data: "active",
                    responsivePriority: 2,
                    className: "btn-td",
                    render: function(data, type, row, meta){
                        return data ? 
                            `<a href="javascript:Users.deactivateUser('${row.id}')" title="Deactivate User">
                                <i class="far fa-check-square fa-2x"><span class="d-none">true</span></i>
                            </a>` 
                            : 
                            `<a href="javascript:Users.activateUser('${row.id}')" title="Activate User">
                                <i class="far fa-square fa-2x"><span class="d-none">false</span></i>
                            </a>`
                    }
                },
                { targets: 1, title: "Name", data: "name", responsivePriority: 1},
                { targets: 2, title: "Role", data: "role", responsivePriority: 3},
                { targets: 3, title: "Town", data: "town", responsivePriority: 5},
                { targets: 4, title: "Gender", data: "gender", responsivePriority: 6},
                { targets: 5, title: "County", data: "county", responsivePriority: 7},
                { 
                    targets: 6, 
                    title: "Delete", 
                    orderable: false,
                    responsivePriority: 4,
                    className: "btn-td",
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Users.deleteUser('${row.id}')" title="Delete User"><i class="fa fa-times fa-2x"></i></a>`                    
                    }  
                },
            ],
            initComplete : function() {
                $("#users-datatable_filter").detach().appendTo('#users-search')

                 this.api().columns([0,2,3,5]).every(function() {
                    var column = this

                    var select = $('<select class="form-control mr-2 col"><option value="">-</option></select>')
                        .appendTo($("#users-filters-dropdown"))
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
    

    // Resets and reloads datatable. 
    static async refreshTable(users){
        startLoad()
        
        if(!$('#users-datatable').text().trim()){
            await this.initialise(users)
        }else{    
            let table = $('#users-datatable').DataTable()

            table.clear() 
                table.rows.add(users)
                table.draw()
        }
   
        endLoad()
    }

    static async activateUser(userId) {
        startLoad()
        await UsersDB.activateUser(userId)
            .then(() => {
                Notification.display(1, "User activated")
                endLoad()
            }).catch(error => {
                Notification.display(2, "Unable to activate user")
                console.log(error.message)
                endLoad()
            })
    }

    static async deactivateUser(userId){
        if(await Prompt.confirm("This action will remove all clients and visits from this user!")){
            startLoad()

            Promise.all([
                UsersDB.deactivateUser(userId),
                VisitsDB.deleteVisits(userId),
                ConnsDB.deleteConns(userId)
            ]).then(() => {
                Notification.display(1, "User deactivated")
                endLoad()
            }).catch(error => {
                Notification.display(2, "Unable to deactivate user")
                console.log(error.message)
                endLoad()
            })
        }
    }

    static async deleteUser(userId){
        if(await Prompt.confirm("This action will permanently remove this user!")){
            startLoad()
            UsersDB.deleteUser(userId)
                .then(() => {
                    Notification.display(1, "User Deleted")
                    endLoad()
                }).catch(error => {
                    console.log(error.message())
                    Notification.display(2, "Unable to delete user")
                    endLoad()
                })
        }
    }
    
    static async openFilters(){
        // Animate.rotate(180, '#btn-users-filter')

        $('#users-filters').removeClass("d-none")
        $('#users-filters').addClass("d-block")

        $('#icon-users-filter').removeClass("fa-chevron-down")
        $('#icon-users-filter').addClass("fa-chevron-up")
    }

    static async closeFilters(){
        // Animate.rotate(180, '#btn-users-filter')

        $('#users-filters').removeClass("d-block")
        $('#users-filters').addClass("d-none")

        $('#icon-users-filter').removeClass("fa-chevron-up")
        $('#icon-users-filter').addClass("fa-chevron-down")
    }

    // Instantiate listeners.
    static async listeners(){
        $('#btn-users-refresh').click(function(){
            Animate.rotate(360, '#btn-users-refresh')

            loadUsers()
        })

        $('#btn-users-filter').click(function(){
            // Show filters else hide filters.  
            if($('#users-filters').hasClass("d-none")){
                Users.openFilters()
            }else{
                Users.closeFilters()
            }
        })

        $('#users-datatable').on('click', 'td', function () {
            var table = $('#users-datatable').DataTable()
            var data = table.row(this).data()
            
            // Prevents load if cell contains a link. E.g. active, delete links. 
            if(!this.innerHTML.includes("<a"))
                loadUser(data.id)

        })
    }
}
