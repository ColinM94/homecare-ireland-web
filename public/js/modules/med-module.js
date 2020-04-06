class MedModule{
    constructor(div, id){
        this.div = div
        this.id = id
       
        $(`${this.div}`).load("views/med.html", () => {
            this.loadData(id)
            this.listeners()
            this.createMedForm()
            Module.show(this.div)
        })
    }

    loadData(id){
        let doc = db.collection('meds').doc(id)
        
        doc.onSnapshot(docSnapshot => {
            let med = new MedModel()
            med.docToMed(docSnapshot)
            this.med = med
            this.displayData(med)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    displayData(med){
        $(`${this.div} #med-title`).text(med.name)
        $(`${this.div} #med-class`).text("")
        $(`${this.div} #med-dosages`).text("")
        $(`${this.div} #med-desc`).text("")
        $(`${this.div} #med-sides`).text("")


        // $(`${this.div} #med-name`).append(med.name + "<br><br>")
        
        $(`${this.div} #med-class`).append(med.type + "<br>")

        med.description.forEach(desc => {
            $(`${this.div} #med-desc`).append(desc + "<br><br>")
        }) 

        med.dosages.forEach(x => {
            console.log(x)
            $(`${this.div} #med-dosages`).append(x + "<br><br>")
        }) 

        med.sideEffects.forEach(side => {
            $(`${this.div} #med-sides`).append(side + "<br>")
        })  

        Module.scroll(this.div)
    }

    createMedForm(){
        let formId = `#edit-med`

        Module.createForm(this.div, formId, "Edit Medication", "Update")
        Module.addField(formId, "text", "med-name", "Name")
        Module.addField(formId, "text", "med-type", "Class")
        Module.addField(formId, "textarea", "med-description", "Description")
        Module.addField(formId, "textarea", "med-dosages", "Dosages")
        Module.addField(formId, "textarea", "med-sides", "Side Effects")
    }

    editMed(){
        let name = $(`${this.div} #edit-med #med-name`).val()
        let type = $(`${this.div} #edit-med #med-type`).val()
        let description = $(`${this.div} #edit-med #med-description`).val().split(/\n/)
        let dosages = $(`${this.div} #edit-med #med-dosages`).val().split(/\n/)
        let sideEffects = $(`${this.div} #edit-med #med-sides`).val().split(/\n/)

        // Removes empty lines from arrays. 
        description = description.filter(item => item)
        dosages = dosages.filter(item => item)
        sideEffects = sideEffects.filter(item => item)

        MedsDB.updateMed(this.id, name, type, description, dosages, sideEffects)
            .then(() => {
                $('#edit-med-modal').modal('hide')
            })
    }

    editMedForm(){
        // $(`${this.div} #edit-med #med-name`).text("")
        $(`${this.div} #edit-med #med-dosages`).text("")
        $(`${this.div} #edit-med #med-description`).text("")
        $(`${this.div} #edit-med #med-sides`).text("")

        $(`${this.div} #edit-med #med-name`).val(this.med.name)
        $(`${this.div} #edit-med #med-type`).val(this.med.type)

        console.log(this.med.description)
        this.med.description.forEach(x => {
            $(`${this.div} #edit-med #med-description`).append(x + "\n\n")
        })

        this.med.dosages.forEach(x => {
            $(`${this.div} #edit-med #med-dosages`).append(x + "\n\n")
        })

        this.med.sideEffects.forEach(x => {
            $(`${this.div} #edit-med #med-sides`).append(x + "\n\n")
        })

        $("#edit-med-modal").modal("show")
    }

    async deleteMed(){
        if(await Prompt.confirm("This action will permanently remove this medication!")){
            MedsDB.deleteMed(this.id)
            .then(() => {
                Notification.display(1, "Medication deleted")
                Module.hide(this.div)
            }).catch(error => {
                console.log(error.message)
                Notification.display(2, "Unable to delete med")
            })
        } 
    }

    listeners(){     
        $(this.div).on('click', '#btn-delete-med', (ref) => {
            this.deleteMed()
        })

        $(this.div).on('click', '#btn-edit', (ref) => {
            this.editMedForm()
        })

        $(this.div).on('click', '#btn-edit-med', (ref) => {
            this.editMed()
        })
    }
}