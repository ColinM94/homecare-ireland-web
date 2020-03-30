class ClientsView{
    static load(){
        this.div = "#clients-view"

        $(this.div).append(`
            <div id="clients-module"></div>
            <div id="client-module"></div>
        `)

        let clients = new ClientsModule(`${this.div} #clients-module`, "", true, true)
        clients.listen(ClientsView.handleEvent)
    }

    static handleEvent(data){
        let div = `${ClientsView.div} #clients-module`

        if(data[0] == "client"){
            ClientsView.loadClient(data[1])
        }
    } 

    static loadClient(client){
        new ClientModule(`${ClientsView.div} #client-module`, client.id)
    }
}
