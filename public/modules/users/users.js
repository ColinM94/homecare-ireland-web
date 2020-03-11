class Users{
    overlay = true
    
    static async load(arg){
        let users = await UsersDB.getUsers()

        $('#datatable').DataTable({
            data: users,
            "lengthChange": false,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatableSearch')
            },
            columns: [
                { title: "ID", data: "id", visible: false},
                { title: "Name", data: "name"},
                { title: "Role", data: "role"},
                { title: "Address 1", data: "address1"},
                { title: "Address 2", data: "address2"},
                { title: "Town", data: "town"},
                { title: "County", data: "county"},
                { title: "Eircode", data: "eircode"},
                { title: "Active", data: "active", visible: false},
                {mRender: function (data, type, row) {
                    if(row.active == true)
                        return `<a href="javascript:Users.deactivateUser('${row.id}')">Deactivate</a>`
                    else
                        return `<a href="javascript:Users.activateUser('${row.id}')">Activate</a>`

                }},
                {mRender: function (data, type, row) {
                    if(row.role == "Admin")
                        return ""
                    else if(row.active == true)
                        return `<a href="javascript:Module.load('UserProfile', '${row.id}')"> View Profile</a>`
                    else if(row.active == false)
                        return `<a href="javascript:Users.deleteUser('${row.id}')">Delete</a>`
                }},
            ],
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
        if(await Prompt.confirm("This action will remove all clients and visits from this user.")){

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
        if(await Prompt.confirm()){
            await UsersDB.deleteUser(userId)
        }

        this.refreshTable()
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

    // Instantiate listeners.
    static async listeners(){
        $('.btn-refresh').click(function(){
            Animate.rotate(360, '.btn-refresh-icon')
            Users.refreshTable()
        })
    }
}
