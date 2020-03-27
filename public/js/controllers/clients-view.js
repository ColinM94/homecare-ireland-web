class ClientsView{
    static load(){
        this.div = "#clients-view"
        
        $(this.div).text("")
        $(this.div).load("views/templates/header.html", () => {
            $(this.div).append(`
                <div class="mt-n5 mx-2 mx-sm-4 ">
                    <div id="users-module"></div>
                    <div id="user-module"></div>
                    <div id="clients-module"></div>
                    <div id="client-module"></div>
                </div>
            `)

            View.setTitle(this.div, "Clients")
            View.setIcon(this.div, "fas fa-users")

            let clients = new ClientsModule(`${this.div} #clients-module`)
            clients.listen(this.listener)
        })
    }

    static listener(data){
        if(data[0] == "client"){
            ClientsView.loadClient(data[1].id)
        }
    }

    static loadClient(id){
        new ClientModule(`${ClientsView.div} #client-module`, id)
    }
}