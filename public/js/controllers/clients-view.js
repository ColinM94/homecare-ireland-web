class ClientsView{
    static load(){
        this.div = "#clients-view"

        $(`${this.div}`).text("")
        $(`${this.div}`).append(`
            <div id="clients-module"></div>
            <div id="client-module"></div>
        `)

        let clients = new ClientsModule(`${this.div} #clients-module`)
        clients.externalListeners(this.listener)
    }

    static listener(event){
        if(event[0] == "client"){
            ClientsView.loadClient(event[1].id)
        }
    }

    static loadClient(id){
        new ClientModule(`${ClientsView.div} #client-module`, id)
        $('#client-module').show()
    }
}