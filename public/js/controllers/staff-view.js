class StaffView{
    static load(){
        this.div = "#staff-view"

        $(`${this.div}`).text("")
        $(`${this.div}`).append(`
            <div id="users-module"></div>
            <div id="user-module"></div>
            <div id="clients-module"></div>
            <div id="client-module"></div>
        `)

        let users = new UsersModule(`${this.div} #users-module`)
        users.listen(this.loadModule)
    }

    static loadModule(data){
        if(data[0] == "user"){
            let user = data[1]
    
            StaffView.loadUser(user.id, user.name)
        }else if(data[0] == "client"){
            let client = data[1]
    
            StaffView.loadClient(client.id)
        }
    }
    static loadUser(id, title){
        new UserModule(`${StaffView.div} #user-module`, id)
        let clients = new ClientsModule(`${StaffView.div} #clients-module`, id, `${title}'s Clients`)
        clients.externalListeners(StaffView.listener)
        $('#client-module').hide()
    }

    static loadClient(id, title){
    
        new ClientModule(`${StaffView.div} #client-module`, id)
        $('#client-module').show()
    }
}


