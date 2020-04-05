class VisitsView{
    constructor(user){
        this.div = "#visits-view"

        $(this.div).append(`
            <div id="visits-module" class="col-12 w-100 module"></div>
            <div id="visit-module" class="col-12 w-100 module"></div>
        `)

        if(user) this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, "", false, false, user.id)
        else this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, "", true, true)
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

    loadClient(client){
        this.clientModule = new ClientModule(`${this.div} #client-module`, client.id)
    }

    loadVisits(client){
        this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, `${client.name}'s Visits`, true, true, client.id)
    }

    loadVisit(visit){
        this.visitModule = new VisitModule(this, `${this.div} #visit-module`, "", visit.id)
    }
}
