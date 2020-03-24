class Medications{
    static overlay = false

    // Populates clients datatable and sets up listeners. 
    static async load() {
        let meds = await MedsDB.getMeds()

        MedsDB.observe() 

        $('#medications-datatable').DataTable( {
            data: meds,
            "lengthChange": false,
            paging: false,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            initComplete : function() {
                $("#medications-datatable_filter").detach().appendTo('#medications-search');
            },
            columnDefs: [
                { targets: 0, title: "Name", data: "name"},
                { 
                    targets: 1, 
                    title: "Details", 
                    orderable: false,
                    render: function(data, type, row, meta){
                       return `<a href="javascript:loadMed('${row.id}')" title="Medication Details"><i class="fas fa-info-circle fa-lg"></i></a>`
                    }
                },
                { 
                    targets: 2, 
                    title: "Edit", 
                    orderable: false,
                    render: function(data, type, row, meta){
                       return `<a href="javascript:Medications.viewEditMedForm('${row.id}')" title="Edit Medication"><i class="fa fa-edit fa-lg"></i></a>`
                    }
                },
                { 
                    targets: 3, 
                    title: "Delete", 
                    orderable: false,
                    render: function(data, type, row, meta){
                        return `<a href="javascript:Medications.deleteMed('${row.id}')" title="Delete Medication"><i class="fa fa-times fa-lg"></i></a>`
                    }
                },
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

        // startLoad()
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
                // endLoad()
            }).catch(error => {
                Notification.display(2, "Unable to retrieve medication details")
                console.log(error.message)
                // endLoad()
            })
    }

    static async editMed(){
        // startLoad()

        let id = $('#edit-med-id').val()
        let name = $("#edit-med-name").val()
        let description = $('#edit-med-desc').val().split(/\n/)
        let sideEffects = $('#edit-med-sides').val().split(/\n/)

        MedsDB.updateMed(id, name, description, sideEffects)
                .then(() => {
                    this.refreshTable()
                    Notification.display(1, "Medication updated")
                    $('#modal-edit-med').modal('hide')
                    // endLoad()
                }).catch(error => {
                    console.log(error.message())
                    Notification.display(2, "Unable to update medication")
                    $('#modal-edit-med').modal('hide')
                    // endLoad()
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
        // startLoad()

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

                // endLoad()
                $('#modal-med-details').modal('show')
            }).catch(error => {
                Notification.display(2, "Unable to load medication details")
                console.log(error.message)
                // endLoad()
            })
    }

    // Resets and reloads datatable. 
    static async refreshTable(){
        // startLoad()
        await MedsDB.getMeds()
            .then(meds => {
                let table = $('#medications-datatable').DataTable()

                table.clear() 
                table.rows.add(meds)
                table.draw()
                // endLoad()

            }).catch(error => {
                Notification.display(2, "Unable to load medications")
                console.log(error.message)
                // endLoad()
            })
    }

    // Instantiates listeners. 
    static async listeners() {
        $("#form-add-med").submit(function(event) {
            event.preventDefault()
            Medications.addMed()
        })

        $("#form-edit-med").submit(function(event) {
            event.preventDefault()
            Medications.editMed()
        })

        $('.btn-refresh').on('click touchstart', function(){
            Animate.rotate(360, '.btn-refresh-icon')
            Medications.refreshTable()
        })
    }
}



