class Users{
    overlay = false
    
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
                $("#datatable_filter").detach().appendTo('#datatableSearch');
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
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Users.deactivateUser('${row.id}')">Deactivate</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Module.load('UserProfile', '${row.id}')">View Profile</a>`
                }},
            ],
        })

        this.listeners()
    }

    // Displays selected user details. 
    static async viewUserProfile(userId){
        $('#user-list').hide()
        $('#user-profile').show() 

        let user = await UsersDB.getUser(userId)

        $('#user-profile-title').html(` ${user.name}'s Profile`)
        $('#user-profile-id').text(` ${user.id}`)
        $('#user-profile-name').text(` ${user.name}`)
        $('#user-profile-mobile').text(` ${user.mobile}`)
        $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)

        this.loadConns(userId)
    }

    static async deactivateUser(userId){
        if(await Prompt.confirm()){
            await UsersDB.deactivateUser(userId)
            this.refreshTable()
        }
    }
    // Instantiate listeners.
    static async listeners(){

    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        let users = await UsersDB.getUsers()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(users)
        table.draw()
    }
}
