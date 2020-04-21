class VisitModule{
    // div: string = Div id/class to load module into. 
    // userId: string = Id of user to be loaded from db. 
    // callBack: class reference = Allows for calling functions in view class. 
    constructor(callBack, div, title, visitId){
        this.div = div
        this.visitId = visitId
        this.callBack = callBack

        $(`${this.div}`).load("views/templates/details.html", () => {
            // Hides header if empty.
            if(title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")
            this.createNoteForm()
            this.observe(visitId)
            this.listeners()
            Module.show(this.div)
        })
    }

    // Observes DB for changes to this user. 
    async observe(){
        let doc = db.collection('visits').doc(this.visitId)
        doc.onSnapshot(docSnapshot => {
            let visit = new VisitModel()
            visit.docToVisit(docSnapshot)

            this.display(visit)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    // Adds user information and buttons. 
    async display(visit){
        let client, user
        await Promise.all([
            client = await ClientsDB.getClient(visit.clientId),
            user = await UsersDB.getUser(visit.userId)
        ])

        Module.clearDetails(this.div)

        Module.setTitle(this.div, `Visit Details`)
        
        Module.appendDetail(this.div, "Carer", user.name)
        Module.appendDetail(this.div, "Client", client.name)
        let address = Format.address(client.address1, client.address2, client.town, client.county, client.eircode)
        Module.appendDetail(this.div, "Address", address)

        Module.appendDetail(this.div, "Start", Convert.tsToDateTime(visit.start))
        Module.appendDetail(this.div, "End", Convert.tsToDateTime(visit.end))
        Module.appendDetail(this.div, "Clock In", Convert.tsToDateTime(visit.clockIn))
        Module.appendDetail(this.div, "Clock Out", Convert.tsToDateTime(visit.clockOut))

        // $(`${this.div} .card-body`).append("Notes<br><br>")
        
        // $(`${div} .card-body`).append(`
        //     <div class="row">
        //         <div class="col">
        //             <span class="font-weight-bold">${name}</span>
        //         </div>
        //         <div class="col">
        //             <span>${value}</span>
        //         </div>
        //     </div>
        //     <hr>`   
        //  )

        // visit.notes.forEach(note => {
        //     // notes += note + `<button class="float-right"><i class="btn-delete-note fas fa-times"></i></button><br><br>`
        //     $(`${this.div} .card-body`).append(note)
        // }) 

        // $(`${this.div} .card-body`).append("<hr>")

        Module.appendList(this.div, "Notes", visit.notes)

        // $(`${this.div} .card-body`).append(`<button id="btn-conn" class="btn btn-primary">Assign Client</button>`)

        Module.scroll(this.div)

        if(webview) Module.appendButtons(this.div, [["btn-clockin", "Clock In"], ["btn-clockout", "Clock Out"]])
        Module.appendButtons(this.div, [["btn-add-note", "Add Note"]])
    }

    createNoteForm(){
        let formId = `#add-visit-notes`

        Module.createForm(this.div, formId, "Notes", "Add Notes")
        
        Module.addField(formId, "textarea", "visit-notes", "Notes")
    }

    addNotes(){
        let notes = $('#visit-notes').val().split(/\n/)

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

        for(let i=0; i<notes.length;i++){
            notes[i] = `${date} @ ${time} by ${currentUser.name}: ${notes[i]}` 
        }
        
        VisitsDB.addNote(this.visitId, notes)
    }

    listeners(){
        $(this.div).on('click', `#btn-add-note`, () => {
            $("#add-visit-notes-modal").modal("show")
        })

        $(this.div).on('click', `#btn-add-visit-notes`, () => {
            this.addNotes()
        })
    }
}