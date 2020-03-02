class Admins{
    static overlay = false

    static async load(){  
        let admins = await UsersDB.getAdmins()

        console.log(admins)
        $('#datatable').DataTable( {
            data: admins,
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
                { title: "Address 1", data: "address1" },
                { title: "Address2", data: "address2" },
            ]
        })

        this.listeners()
    }

    // Instantiate listeners. 
    static listeners() {
        
    }
}