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
                { title: "ID", data: "id", visible: false},
                { title: "Name", data: "name" },
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.viewEditMedForm('${row.id}')">Edit</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.deleteMed('${row.id}')">Delete</a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.viewDetails('${row.id}')">View Details</a>`
                }},
            ]
        })

        this.listeners()
    }

    static async addMed(){
        let name = $("#add-med-name").val()
        let description = $('#add-med-desc').val().split(/\n/)
        let sideEffects = $('#add-med-sides').val().split(/\n/)

        // Removes empty lines from arrays. 
        description = description.filter(item => item)
        sideEffects = sideEffects.filter(item => item)

        await MedsDB.addMed(name, description, sideEffects)

        $('#modal-add-med').modal('hide')

        this.refreshTable()
    }

    static async viewEditMedForm(id){
        $('#modal-edit-med').modal('show')

        MedsDB.getMed(id)
            .then(result => {
                $('#edit-med-name').val(result.name)
            })
    }

    static async deleteMed(id){
        if(await Prompt.confirm()){
            await MedsDB.deleteMed(id)
                .then(() => {
                    Notification.display(1, "Medication deleted")
                }).catch(error => {
                    console.log(error.message())
                    Notification.display(2, "Unable to delete medication")
                })
            this.refreshTable()
        }
    }

    static async viewDetails(id){
        $('#med-details-desc').empty()
        $('#med-details-sides').empty()


		// $('html').find('*').not('.lds-facebook').addClass('blur');

        MedsDB.getMed(id)
            .then(med => {
                $('#med-details-title').text(med.name)
      
                for(let i=0; i<med.description.length; i++){
                    $('#med-details-desc').append(med.description[i] + "</br>")
                }

                for(let i=0; i<med.sideEffects.length; i++){
                    $('#med-details-sides').append(med.sideEffects[i] + "</br>")
                }

                $('#modal-med-details').modal('show')
            }).catch(error => {
                Notification.display(2, "Unable to load medication details")
                console.log(error.message)
            })
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



