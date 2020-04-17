class ClientModule{
    // div: string = Div id/class to load module into. 
    // userId: string = Id of user to be loaded from db. 
    constructor(div, clientId, title){
        this.div = div
        this.clientId = clientId

        $(`${div}`).load("views/templates/details.html", () => {

            // if(showAdd) $(`${div} #btn-add`).removeClass("d-none")
            $(`${this.div} #title`).text(title)
            // Hides header if empty.
            if(title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")

            this.listeners()
            this.observe(clientId)
            $(this.div).show()
        })
    }

    // Loads data and listens for changes. 
    observe(clientId){
        let doc = db.collection('clients').doc(clientId)
        doc.onSnapshot(docSnapshot => {
            let client = new ClientModel()
            client.docToClient(docSnapshot)
            this.displayData(client)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading client")
        })
    }

    displayData(client){
        Module.clearDetails(this.div)

        // Module.setTitle(this.div, `${client.name}'s Details`)

        Module.appendDetail(this.div, "Name", client.name)
        Module.appendDetail(this.div, "Gender", client.gender)
        Module.appendDetail(this.div, "Date of Birth", Convert.tsToDate(client.dob))
        Module.appendDetail(this.div, "Mobile", client.mobile)
        Module.appendDetail(this.div, "Marital Status", client.marital)

        let address = Format.address(client.address1, client.address2, client.town, client.county, client.eircode)
        Module.appendDetail(this.div, "Address", address)

        Module.appendDetail(this.div, "Archived", Convert.boolToText(client.archived))

        // Module.appendButtons(this.div, [["btn-visits", "Show Visits"], ["btn-kind", "Show Next of Kin"]])
        Module.scroll(this.div)
    }

    listeners(){
        // Removes previously set listeners to prevent duplication. 
        $(this.div).off('click')
    }
}