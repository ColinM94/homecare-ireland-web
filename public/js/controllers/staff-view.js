class StaffView{
    static load(){
        this.div = "#staff-view"

        $(this.div).append(`
            <div id="users-module" class="col-12 w-100"></div>
            <div id="user-module" class="col-12 w-100"></div>
            <div id="clients-module" class="col-12 w-100"></div>
            <div id="client-module" class="col-12 w-100"></div>
        `)

        let users = new UsersModule(`${this.div} #users-module`, "", true)
        users.listen(this.handleEvent)
    }

    static handleEvent(data){
        let div = `${StaffView.div} #user-module`

        if(data[0] == "user"){
            StaffView.loadUser(data[1])
            StaffView.loadClients(data[1])
        }else if(data[0] == "client"){
            StaffView.loadClient(data[1])
        }
    }

    static loadUser(user){
        new UserModule(`${StaffView.div} #user-module`, user.id)
        $(`${StaffView.div} #client-module`).hide()

    }

    static loadClients(user){
        let clients = new ClientsModule(`${StaffView.div} #clients-module`, `${user.name}'s Clients`, false, false, user.id)
        clients.listen(StaffView.handleEvent)
    }

    static loadClient(client){
        new ClientModule(`${StaffView.div} #client-module`, client.id)
        $(`${StaffView.div} #client-module`).show()
    }
}


