class StaffView{
    constructor(){
        this.div = "#staff-view"

        $(this.div).append(`
            <div id="users-module" class="col-12 w-100 module"></div>
            <div id="user-module" class="col-12 w-100 module"></div>
            <div id="clients-module" class="col-12 w-100 module"></div>
            <div id="client-module" class="col-12 w-100 module"></div>
        `)
        
        this.usersModule = new UsersModule(this, `${this.div} #users-module`, "", true, false)
    }

    // Handles callbacks from modules. 
    handle(data){
        if(data[0] == "user"){
            this.loadUser(data[1])
            this.loadClients(data[1])
        }else if(data[0] == "client"){
            this.loadClient(data[1])
        }
    }

    loadUser(user){ 
        this.userModule = new UserModule(this, `${this.div} #user-module`, user.id)  
    }

    loadClients(user){
        this.clientsModule = new ClientsModule(this, `${this.div} #clients-module`, `${user.name}'s Clients`, false, true, user.id)
    }

    loadClient(client){
        this.clientModule = new ClientModule(`${this.div} #client-module`, client.id)
    }
}


