class ClientModule{
    // div: string = Div id/class to load module into. 
    // userId: string = Id of user to be loaded from db. 
    constructor(div, client, title, archiver){
        this.div = div
        this.client = client
        this.archiver = archiver
        
        $(`${div}`).load("views/templates/details.html", () => {

            // if(showAdd) $(`${div} #btn-add`).removeClass("d-none")
            $(`${this.div} #title`).text(title)
            // Hides header if empty.
            if(title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")

            if(currentUser.role == "Doctor") this.createPrescForm()

            this.listeners()
            this.observe()
            $(this.div).show()
        })
    }

    // Loads data and listens for changes. 
    observe(){
        let doc = db.collection('clients').doc(this.client.id)
        doc.onSnapshot(docSnapshot => {
            let client = new ClientModel()
            client.docToClient(docSnapshot)
            this.displayData(client)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading client")
        })
    }

    async archive(){
        if(await Prompt.confirm("This action will archive this client!")){
            ClientsDB.archive(this.client.id)
            Notification.display(3, "User archived")
        }
    }

    async unArchive(){
        ClientsDB.unArchive(this.client.id)
        Notification.display(3, "Client restored")
    }

    displayData(client){
        Module.clearDetails(this.div)

        // Module.setTitle(this.div, `${client.name}'s Details`)

        if(this.archiver) {
            if(client.archived){
                $("#btn-unarchive").removeClass("d-none")
                $("#btn-archive").addClass("d-none")
            } 
            else{
                $("#btn-archive").removeClass("d-none")
                $("#btn-unarchive").addClass("d-none")
            }
        }

        Module.appendDetail(this.div, "Name", client.name)
        Module.appendDetail(this.div, "Gender", client.gender)
        Module.appendDetail(this.div, "Date of Birth", Convert.tsToDate(client.dob))
        Module.appendDetail(this.div, "Mobile", client.mobile)
        Module.appendDetail(this.div, "Marital Status", client.marital)

        let address = Format.address(client.address1, client.address2, client.town, client.county, client.eircode)
        Module.appendDetail(this.div, "Address", address)

        Module.appendDetail(this.div, "Archived", Convert.boolToText(client.archived))

        $(`${this.div} .card-body`).append(`
                <div class="row">
                    <div class="col">
                        <span class="font-weight-bold">Prescriptions</span>
                        <button class="btn" id="btn-prescribe" title="Add Prescription"><i class="fas fa-plus fa-lg"></i></button>
                    </div>
                </div>
                `)

            if(currentUser.role != "Doctor") $("#btn-prescribe").addClass("d-none")

        db.collection("prescriptions")
            .where('clientId', '==', this.client.id).get()
            .then(prescs => {
                prescs.forEach(doc => {
                    let presc = new PrescModel()
                    presc.docToPresc(doc)

                    MedsDB.getMed(presc.medId)
                        .then(med => {
                            $(`${this.div} .card-body`).append(`
                                <div class="row mb-2">
                                    <span class="col">Medication: ${med.name}<br>Dosage: ${presc.dosage}<br>Notes: ${presc.notes}</span>
                                </div>
                        `) 
                    })
                })
            })

        // Module.appendButtons(this.div, [["btn-visits", "Show Visits"], ["btn-kind", "Show Next of Kin"]])
        Module.scroll(this.div)
    }

    async createPrescForm(){
        let formId = `#add-prescription`

        Module.createForm(this.div, formId, "Prescription", "Prescribe")

        let meds = await MedsDB.getMeds()

        Module.addField(formId, "select", "add-med-name", "Medication")
        Module.addField(formId, "text", "add-med-dosage", "Dosage")
        Module.addField(formId, "text", "add-med-notes", "Notes")

        meds.forEach(med => {
            $("#add-med-name").append(new Option(med.name, med.id))
        })
    }

    addPresc(){
        let medId = $("#add-med-name").val()
        let dosage = $("#add-med-dosage").val()
        let notes = $("#add-med-notes").val()

        let prescription = new PrescModel(null, medId, this.client.id, dosage, notes)

        db.collection("prescriptions").add(prescription.toFirestore())
            .then(() => {
                Notification.display(1, "Prescription added")
                $("#add-prescription-modal").modal("hide")
            }).catch(error => {
                console.log(error.message)
                Notification.display(2, "Unable to add prescription")
            })

    }

    listeners(){
        // Removes previously set listeners to prevent duplication. 
        $(this.div).off('click')

        $(this.div).on('click', `#btn-archive`, () => {
            this.archive()
        })

        $(this.div).on('click', `#btn-unarchive`, () => {
            this.unArchive()
        })

        $(this.div).on('click', `#btn-prescribe`, () => {
            // $('#add-prescription')[0].reset();
            $("#add-prescription-modal").modal("show")
        })

        $(this.div).on('click', `#btn-add-prescription`, () => {
            this.addPresc()
        })
    }
}