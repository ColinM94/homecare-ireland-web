class ClientsView{
    constructor(user){
        this.div = "#clients-view"
        this.user = user
        $(this.div).append(`
            <div id="clients-module" class="col-12 w-100 module"></div>
            <div id="client-module" class="col-12 w-100 module"></div>
            <div id="kin-module" class="col-12 w-100 module"></div>
            <div id="visits-module" class="col-12 w-100 module"></div>
            <div id="visit-module" class="col-12 w-100 module"></div>
        `)

        if(user) this.clientsModule = new ClientsModule(this, `${this.div} #clients-module`, "", false, false, user.id)
        else this.clientsModule = new ClientsModule(this, `${this.div} #clients-module`, "", true, true)
    }

    handle(data){
        if(data[0] == "client"){
            let client = data[1]
            this.loadClient(client)
            this.loadVisits(client)
        }else if(data[0] == "visit"){
            let visit = data[1]
            this.loadVisit(visit)
        }
    } 

    async loadClient(client){
        this.clientModule = new ClientModule(`${this.div} #client-module`, client, `${client.name}`, true)

        if(client.kinId != undefined && client.kinId.length > 25){
            let user = await UsersDB.getUser(client.kinId)
            this.kinModule = new UserModule(this, `${this.div} #kin-module`, user, `${client.name}'s Next of Kin`, null, null, false)
        }else{
            this.kinModule = new UserModule(this, `${this.div} #kin-module`, null, `${client.name}'s Next of Kin`, "No next of kin!", client, false)
        }
        // else Module.hide(`${this.div} #kin-module`)
    }

    loadVisits(client){
        this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, `${client.name}'s Visits`, false, true, client.id)
    }

    loadVisit(visit){
        this.visitModule = new VisitModule(this, `${this.div} #visit-module`, "", visit.id)
    }
}
