class Meds{
    static overlay = false

    // Populates clients datatable and sets up listeners. 
    static async load() {
        let meds = await MedsDB.getMeds()

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
                    return `<a href="javascript:Meds.viewDetails('${row.id}')" title="Medication Details"><i class="fas fa-info-circle fa-lg"></i></a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.viewEditMedForm('${row.id}')" title="Edit Medication"><i class="fa fa-edit fa-lg"></i></a>`
                }},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:Meds.deleteMed('${row.id}')" title="Delete Medication"><i class="fa fa-times fa-lg"></i></a>`
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
        $('#edit-med-desc').empty()
        $('#edit-med-sides').empty()

        startLoad()
        MedsDB.getMed(id)
            .then(med => {
                $('#edit-med-id').val(id)

                if($('#edit-med-name').val() != null)
                    $('#edit-med-name').val(med.name)

                for(let i=0; i<med.description.length; i++){
                    $('#edit-med-desc').append(med.description[i] + "\n")
                }

                for(let i=0; i<med.sideEffects.length; i++){
                    $('#edit-med-sides').append(med.sideEffects[i] + "\n")
                }

                $('#modal-edit-med').modal('show')
                endLoad()
            }).catch(error => {
                Notification.display(2, "Unable to retrieve medication details")
                console.log(error.message)
                endLoad()
            })
    }

    static async editMed(){
        startLoad()

        let id = $('#edit-med-id').val()
        let name = $("#edit-med-name").val()
        let description = $('#edit-med-desc').val().split(/\n/)
        let sideEffects = $('#edit-med-sides').val().split(/\n/)

        MedsDB.updateMed(id, name, description, sideEffects)
                .then(() => {
                    this.refreshTable()
                    Notification.display(1, "Medication updated")
                    $('#modal-edit-med').modal('hide')
                    endLoad()
                }).catch(error => {
                    console.log(error.message())
                    Notification.display(2, "Unable to update medication")
                    $('#modal-edit-med').modal('hide')
                    endLoad()
                })
    }

    static async deleteMed(id){
        if(await Prompt.confirm()){
            MedsDB.deleteMed(id)
                .then(() => {
                    this.refreshTable()
                    Notification.display(1, "Medication deleted")
                }).catch(error => {
                    console.log(error.message())
                    Notification.display(2, "Unable to delete medication")
                })
        }
    }

    static async viewDetails(id){
        startLoad()

        $('#med-details-desc').empty()
        $('#med-details-sides').empty()

        MedsDB.getMed(id)
            .then(med => {
                $('#med-details-title').text(med.name)
      
                for(let i=0; i<med.description.length; i++){
                    $('#med-details-desc').append(med.description[i] + "</br>")
                }

                for(let i=0; i<med.sideEffects.length; i++){
                    $('#med-details-sides').append(med.sideEffects[i] + "</br>")
                }

                endLoad()
                $('#modal-med-details').modal('show')
            }).catch(error => {
                Notification.display(2, "Unable to load medication details")
                console.log(error.message)
                endLoad()
            })
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        startLoad()
        await MedsDB.getMeds()
            .then(meds => {
                let table = $('#datatable').DataTable()

                table.clear() 
                table.rows.add(meds)
                table.draw()
                endLoad()

            }).catch(error => {
                Notification.display(2, "Unable to load medications")
                console.log(error.message)
                endLoad()
            })


    }

    // Instantiates listeners. 
    static async listeners() {
        $("#form-add-med").submit(function(event) {
            event.preventDefault()
            Meds.addMed()
        })

        $("#form-edit-med").submit(function(event) {
            event.preventDefault()
            Meds.editMed()
        })

        $('.btn-refresh').click(function(){
            Animate.rotate(360, '.btn-refresh-icon')
            Meds.refreshTable()
        })
    }
}



