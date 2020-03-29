class StaffView{
    static load(){
        this.div = "#staff-view"

        $(this.div).text("")
        $(this.div).load("views/templates/header.html", () => {
            $(this.div).append(`
                <div class="row w-100 mx-0 px-0">
                    <div id="users-module" class="col-12 w-100"></div>
                    <div id="user-module" class="col-12 col-lg-6 w-100"></div>
                    <div id="clients-module" class="col-12 col-lg-6 w-100"></div>
                    <div id="client-module" class="col-12 col-lg-6 w-100"></div>
                </div>
            `)

            View.setTitle(this.div, "Staff")
            View.setIcon(this.div, "fas fa-user-md")
            let users = new UsersModule(`${this.div} #users-module`)
            users.listen(this.handleEvent)
        })
    }

    static handleEvent(data){
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
        let clients = new ClientsModule(`${StaffView.div} #clients-module`, `${title}'s Clients`, id, false, false)
        clients.listen(StaffView.handleEvent)
        $('#client-module').hide()
    }

    static loadClient(id, title){
    
        new ClientModule(`${StaffView.div} #client-module`, id)
        $('#client-module').show()
    }
}


