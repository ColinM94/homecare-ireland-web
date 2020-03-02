class Meds{
    static overlay = false

    // Populates clients datatable and sets up listeners. 
    static async load() {
        let meds = await MedsDB.getMeds()
                console.log(meds)

        $('#datatable').DataTable( {
            data: meds,
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
                { title: "ID", data: "id"},
                { title: "Name", data: "name" },
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.viewEditMedForm('${row.id}')">Edit</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.deleteMed('${row.id}')">Delete</a>`
                }},
            ]
        })

        this.listeners()
    }

    static async addMed(){
        let name = $("#med-name").val()

        MedsDB.addMed(name)

        $('#modal-add-med').modal('hide')

        this.refreshTable()
    }

    static async viewEditMedForm(id){
        $('#modal-edit-med').modal('show')

        console.log(id)

        MedsDB.getMed(id)
            .then(result => {
                console.log(result)
                console.log(result.name)
                $('#edit-med-name').val(result.name)
            })
    }

    static async deleteMed(id){
        if(await Prompt.confirm()){
            await MedsDB.deleteMed(id)
            this.refreshTable()
        }
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        let meds = await MedsDB.getMeds()

        let table = $('#datatable').DataTable()

        table.clear() 
        table.rows.add(meds)
        table.draw()
    }

    // Instantiates listeners. 
    static async listeners() {
        $("#form-add-med").submit(function(event) {
            event.preventDefault()
            Meds.addMed()
        })
    }
}



