class ClientModule{
    constructor(div, id){
        this.div = div

        $(`${this.div}`).load("views/client.html", () => {
            this.loadData(id)
            this.listeners()
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

    displayData(client){
        $(`${this.div} #title`).text(`${client.name}'s Details`)

        $('#client-profile-id').text(` ${client.id}`)

        if(client.archived) $('#client-profile-archived').text(" Yes")
        else $('#client-profile-archived').text(`No`)

        $('#client-profile-role').text(`${client.role}`)
        $('#client-profile-name').text(`${client.name}`)
        $('#client-profile-gender').text(`${client.gender}`)
        $('#client-profile-mobile').text(`${client.mobile}`)
        $('#client-profile-address').text(`${client.address1}, ${client.address2}, ${client.town}, ${client.county}, ${client.eircode}`)
    }

    listeners(){

    }
}