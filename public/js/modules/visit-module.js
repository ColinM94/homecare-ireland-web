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

        let notes = ""

        visit.notes.forEach(note => {
            notes += note + `<button class="float-right"><i class="btn-delete-note fas fa-times"></i></button><br><br>`
        }) 

        Module.appendDetail(this.div, "Notes", notes)

        // $(`${this.div} .card-body`).append(`<button id="btn-conn" class="btn btn-primary">Assign Client</button>`)

        Module.scroll(this.div)
    }

    listeners(){

    }
}