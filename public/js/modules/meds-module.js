class MedsModule{ 
    constructor(callback, div, title, showSearch, showAdd, user){
        this.div = div
        this.callback = callback
    
        $(`${div}`).load("views/templates/datatable.html", () => {
            // if(user.role == "Doctor" || user.role == "Admin") {
            //     $(`${this.div} #modal`).load("views/modals/add-med.html")
            // }

            if(showSearch){
                $(`${div} #datatable-search`).removeClass("d-none")
                $(`${div} #btn-filters`).removeClass("d-none")
            } 

            if(showAdd) $(`${div} #btn-add`).removeClass("d-none")

            $(`${this.div} #title`).text(title)

            this.createMedForm()

            this.observe()
            this.listeners()
            Module.show(this.div)
        })
    }

    // Watches for changes in db and auto updates table. 
    observe(){
        let query = db.collection('meds')

        query.onSnapshot(querySnapshot => {
                let meds = new Array()

                querySnapshot.forEach(doc => {
                    let med = new MedModel()
                    med.docToMed(doc)
                    meds.push(med)
                })

                this.loadTable(meds)

            }, err => {
                console.log(`Encountered error: ${err}`)
                Notification.display(2, "Problem loading medications")
        })
    }

    loadTable(meds){
        if(this.datatable){
            this.datatable
                .clear()
                .rows.add(meds)
                .draw()

            return
        }
      
        this.datatable = $(`${this.div} #datatable`).DataTable({
            data: meds,
            // bLengthChange: false,
            paging: false,
            filter: true,
            info: false,
            // responsive: false,
            // "scrollX": true,
            responsive: {
                details: false
            },
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { targets: 0, title: "Name", data: "name", responsivePriority: 1},
                { targets: 1, title: "Class", data: "type", responsivePriority: 2},
            ],
            initComplete : (ref) => {
                Table.filters(ref, this.div, [1], ["Class"], true)
                Table.detachSearch(this.div)    
            },
        })
    }

    createMedForm(){
        let formId = `#add-med`

        Module.createForm(this.div, formId, "New Medication", "Add")
        Module.addField(formId, "text", "med-name", "Name")
        Module.addField(formId, "text", "med-type", "Class")
    //     {"Allergenics":"Allergenics","Alternative Medicine":"Alternative Medicine", "Anti Infectives":"Anti Infective", "Antineoplastics":"Antineoplastics",
    //     "Biologicals":"Biologicals", "Cardiovascular Agents":"Cardiovascular Agents", ""    
    // })
        Module.addField(formId, "textarea", "med-description", "Description")
        Module.addField(formId, "textarea", "med-dosages", "Dosages")
        Module.addField(formId, "textarea", "med-sides", "Side Effects")
    }

    addMed(){
        let name = $(`${this.div} #med-name`).val()
        let type = $(`${this.div} #med-type`).val()
        let description = $(`${this.div} #med-description`).val().split(/\n/)
        let dosages = $(`${this.div} #med-dosages`).val().split(/\n/)
        let sideEffects = $('#med-sides').val().split(/\n/)
        
        if(!name){
            Notification.formError("Please enter a name!")
        }else if(!type){
            Notification.formError("Please enter a type!")
        }else{
            Notification.formError("")

            // Removes empty lines from arrays. 
            description = description.filter(item => item)
            dosages = dosages.filter(item => item)
            sideEffects = sideEffects.filter(item => item)

            MedsDB.addMed(name, type, description, dosages, sideEffects)
                .then(() => {
                    $('#add-med-modal').modal('hide')
                })

        }
    }

    // Internal listeners.
    listeners(div){
        // Toggles display of table filters. 
        $(this.div).on('click', '#btn-filters', (ref) => {
            toggleFilters(this.div)
        })

        // Switches between showing archived and non archived users. 
        $(this.div).on('click', '#checkbox-archived', (ref) => {
            if(ref.target.checked) this.showArchived = true
            else this.showArchived = false

            this.loadData()
        })

        $(this.div).on('click', '#btn-add', (ref) => {
            $('#modal-add-med').modal('show')
        })
    }

    listeners(){
        $(this.div).on('click', 'tr', (ref) => {
            let med = Table.rowClick(this.datatable, ref)

            // Prevents loading module if table header row is clicked. 
            if(med != undefined){
                this.callback.handle(["med", med])
            }
        })

        // Toggles display of table filters. 
        $(this.div).on('click', '#btn-filters', (ref) => {
            toggleFilters(this.div)
        })
 
        $(this.div).on('click', '#btn-add', (ref) => {
            $('#add-med')[0].reset();
            $("#add-med-modal").modal("show")
        })

        $(this.div).on('click', '#btn-add-med', (ref) => {
            this.addMed()
        })
    }
}
