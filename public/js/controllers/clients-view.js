class ClientsView{
    constructor(){
        this.div = "#clients-view"

        $(this.div).append(`
            <div id="clients-module" class="col-12 w-100 module"></div>
            <div id="client-module" class="col-12 w-100 module"></div>
        `)

        this.clientsModule = new ClientsModule(this, `${this.div} #clients-module`, "", true, true)
    }

    handle(data){
        if(data[0] == "client"){
            this.loadClient(data[1])
        }
    } 

    loadClient(client){
        this.clientModule = new ClientModule(`${this.div} #client-module`, client.id)
    }
}
