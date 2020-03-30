class MedsModule{ 
    constructor(div){
        this.div = div

        $(div).load("views/meds.html", () => {
            $(`${div} #content`).load("views/templates/datatable.html", () => {
                this.observe()
                this.listeners()
                $(`${this.div} #title`).text("Medication")
                $(`${this.div} #btn-filters`).hide()

            })
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
            ],
            initComplete : (ref) => {
                // Table.filters(ref, this.div, [1,2,3,4], ["Role", "Gender", "Town", "County"], true)
                Table.detachSearch(this.div)    
            },
        })
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

    // External listeners.
    listen(callback){
        $(this.div).on('click', 'tr', (ref) => {
            let med = Table.rowClick(this.datatable, ref)

            // Prevents loading module if table header row is clicked. 
            if(med != undefined){
                callback(["med", med])
            }
        })
    }
}
