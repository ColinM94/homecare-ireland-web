class StaffView{
    constructor(){
        this.div = "#staff-view"
console.log("Heeeyyy")
        $(this.div).append(`
            <div id="users-module" class="col-12 w-100 module"></div>
            <div id="user-module" class="col-12 w-100 module"></div>
            <div id="visits-module" class="col-12 w-100 module"></div>
            <div id="visit-module" class="col-12 w-100 module"></div>
            <div id="clients-module" class="col-12 w-100 module"></div>
            <div id="client-module" class="col-12 w-100 module"></div>
        `)
        
        this.usersModule = new UsersModule(this, `${this.div} #users-module`, "", true, false)
    }

    // Handles callbacks from modules. 
    handle(data){
        if(data[0] == "user"){
            let user = data[1]
            this.loadUser(user)
            this.loadVisits(user)
            this.loadClients(user)
        }else if(data[0] == "client"){
            this.loadClient(data[1])
        }else if(data[0] == "visit"){
            this.loadVisit(data[1])
        }
    }

    loadUser(user){ 
        this.userModule = new UserModule(this, `${this.div} #user-module`, user.id)  
    }

    loadVisits(user){
        this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, `${user.name}'s Visits`, false, false, user.id)
    }

    loadVisit(visit){
        this.visitModule = new VisitModule(this, `${this.div} #visit-module`, visit.id)
    }

    loadClients(user){
        this.clientsModule = new ClientsModule(this, `${this.div} #clients-module`, `${user.name}'s Clients`, true, true, user.id)
    }

    loadClient(client){
        this.clientModule = new ClientModule(`${this.div} #client-module`, client.id)
    }
}


