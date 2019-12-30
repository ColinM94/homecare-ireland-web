async function setupUsers () {
    let users = await getUsers()
    
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
            { title: "Name", data: "name"},
            { title: "Role", data: "role"},
            { title: "Address 1", data: "address1"},
            { title: "Address 2", data: "address2"},
            { title: "Town", data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
        ],
        "bLengthChange": false
    })
}