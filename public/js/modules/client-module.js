class ClientModule{
    constructor(div, id){
        this.div = div

        $(`${this.div}`).load("views/templates/details.html", () => {
            this.listeners()
            let db = new ClientsDB()
            db.listenClient(ClientModule.displayData, id, this.div)
        })
    }

    loadData(id){
        let doc = db.collection('clients').doc(id)
        let observer = doc.onSnapshot(docSnapshot => {
            let client = new ClientModel()
            client.docToClient(docSnapshot)
            this.displayData(client)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    static displayData(client, div){
        Module.clearDetails(div)

        Module.appendDetail(div, "Name", client.name)
        Module.appendDetail(div, "Gender", client.gender)
        Module.appendDetail(div, "Date of Birth", client.dob)
        Module.appendDetail(div, "Mobile", client.mobile)
        Module.appendDetail(div, "Marital Status", client.marital)

        let address = Format.address(client.address1, client.address2, client.town, client.county, client.eircode)
        Module.appendDetail(div, "Address", address)

        Module.appendDetail(div, "Archived", Convert.boolToText(client.archived))
        Module.scroll(div)
    }

    listeners(){

    }
}