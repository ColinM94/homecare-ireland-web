class Users{
    overlay = true
    
    static async load(arg){
        let users = await UsersDB.getUsers()

        $('#datatable').DataTable({
            data: users,
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
                    title: "Active", 
                    data: "active",
                    render: function(data, type, row, meta){
                        return data ? `<a href="javascript:Users.deactivateUser('${row.id}')" title="Deactivate User"><i class="far fa-check-square fa-lg"><span class="d-none">true</span></i></a>` : `<a href="javascript:Users.activateUser('${row.id}')" title="Activate User"><i class="far fa-square fa-lg"><span class="d-none">false</span></i></a>`
                    }
                },
                { targets: 1, title: "Name", data: "name"},
                { targets: 2, title: "Role", data: "role"},
                { targets: 3, title: "Town", data: "town"},
                { targets: 4, title: "Gender", data: "gender"},
                { targets: 5, title: "County", data: "county"},
                { 
                    targets: 6, 
                    title: "Profile", 
                    orderable: false,
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Module.load('UserProfile', '${row.id}')" title="View User Profile"><i class="fa fa-user fa-lg"></i></a>`
                    }  
                },
                { 
                    targets: 7, 
                    title: "Delete", 
                    orderable: false,
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Users.deleteUser('${row.id}')" title="Delete User"><i class="fa fa-times fa-lg"></i></a>`                    
                    }  
                },
            ],
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatable-search')

                 this.api().columns([4,1,2,3]).every(function() {
                    var column = this

                    var select = $('<select class="form-select text-secondary mr-2 col"><option value="">No Filter</option></select>')
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

    static async activateUser(userId) {
        await UsersDB.activateUser(userId)
            .then(() => {
                Notification.display(1, "User activated")
            }).catch(error => {
                Notification.display(2, "Unable to activate user")
                console.log(error.message)
            })
            
        this.refreshTable()
    }

    static async deactivateUser(userId){
        if(await Prompt.confirm("This action will remove all clients and visits from this user!")){

            await Promise.all([
                await UsersDB.deactivateUser(userId),
                await VisitsDB.deleteVisits(userId),
                await ConnsDB.deleteConns(userId)
            ]).then(() => {
                Notification.display(1, "User deactivated")
            }).catch(error => {
                Notification.display(2, "Unable to deactivate user")
                console.log(error.message)
            })
            
            this.refreshTable()
        }
    }

    static async deleteUser(userId){
        if(await Prompt.confirm("This action will permanently remove this user!")){
            UsersDB.deleteUser(userId)
                .then(() => {
                Notification.display(1, "User Deleted")
                endLoad()
            }).catch(error => {
                console.log(error.message())
                Notification.display(2, "Unable to delete user")
                endLoad()
            })
            this.refreshTable()
        }
    }
    
    // Resets and reloads datatable. 
    static async refreshTable(){
        startLoad()

        UsersDB.getUsers()
            .then(users => {
                let table = $('#datatable').DataTable()

                table.clear() 
                table.rows.add(users)
                table.draw()
                endLoad()
            }).catch(error => {
                console.log(error.message)
                Notification.display(2, "Unable to load users")
                endLoad()
            })
    }

    static async openFilters(){
        Animate.rotate(180, '.btn-filter')

        $('#users-filters').removeClass("d-none")
        $('#users-filters').addClass("d-block")

        $('#icon-users-filter').removeClass("fa-chevron-down")
        $('#icon-users-filter').addClass("fa-chevron-up")
    }

    static async closeFilters(){
        Animate.rotate(180, '.btn-filter')

        $('#users-filters').removeClass("d-block")
        $('#users-filters').addClass("d-none")

        $('#icon-users-filter').removeClass("fa-chevron-up")
        $('#icon-users-filter').addClass("fa-chevron-down")
    }

    // Instantiate listeners.
    static async listeners(){
        $('.btn-refresh').click(function(){
            Animate.rotate(360, '.btn-refresh-icon')
            Users.refreshTable()
        })

        $('#btn-users-filter').click(function(){

            // Show filters else hide filters.  
            if($('#users-filters').hasClass("d-none")){
                Users.openFilters()
            }else{
                Users.closeFilters()
            }
        })
    }
}
