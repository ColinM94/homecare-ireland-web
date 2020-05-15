class ClientView{
    constructor(user){
        this.div = "#client-view"
        this.user = user
        $(this.div).append(`
            <div id="client-module" class="col-12 w-100 module"></div>
            <div id="visits-module" class="col-12 w-100 module"></div>
            <div id="visit-module" class="col-12 w-100 module"></div>
        `)

        if(user.kinId != ""){
            ClientsDB.getClient(user.kinId)
                .then(client => {
                    this.clientModule = new ClientModule(`${this.div} #client-module`, client, "", false)
                    this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, "Visits", false, false, user.kinId)
                })
        }else{
            Notification.display(2, "Your next of kin has not been assigned")
        }
    }

    handle(data){
        if(data[0] == "visit"){
            let visit = data[1]
            this.loadVisit(visit)
        }
    } 

    loadVisit(visit){
        this.visitModule = new VisitModule(this, `${this.div} #visit-module`, "", visit.id)
    }
}
