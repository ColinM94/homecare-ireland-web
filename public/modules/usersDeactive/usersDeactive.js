class UsersDeactive{
    overlay = false
    // Requires that client module is loaded first. 
    static async load() {
        let users = await UsersDB.getDeactiveUsers()

        $('#datatable').DataTable({
            data: users,
            "lengthChange": false,
            paging: false,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatableSearch');
            },
            columns: [
                { title: "ID", data: "id", visible: false},
                { title: "Name", data: "name" },
                { title: "Address 1", data: "address1"},
                { title: "Address 2",data: "address2"},
                { title: "Town",data: "town"},
                { title: "County", data: "county"},
                { title: "Eircode", data: "eircode"},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:UsersDeactive.activateUser('${row.id}')">Activate</a>`
                }},
            ]
        })
    }

    static async activateUser(userId) {
        await UsersDB.activateUser(userId)
            .then(() => {
                Message.display(1, "User activated")
            }).catch(error => {
                Message.display(2, "Unable to activate user")
                console.log(error.message)
            })
            
        this.refreshTable()
    }

    // Resets and reloads users datatable. 
    static async refreshTable(){
        let users = await UsersDB.getDeactiveUsers()
        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(users)
        table.draw()
    }
}
