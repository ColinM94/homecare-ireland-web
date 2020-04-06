class ClientView{
    constructor(user){
        this.div = "#client-view"
        this.user = user
        $(this.div).append(`
            <div id="client-module" class="col-12 w-100 module"></div>
            <div id="visits-module" class="col-12 w-100 module"></div>
        `)

        if(user.clientId != ""){
            this.clientModule = new ClientModule(`${this.div} #client-module`, user.kinId, "")
            this.visitsModule = new VisitsModule(this, `${this.div} #visits-module`, "Visits", false, false, user.kinId)
        }else{
            Notification.display(2, "Your next of kin has not been assigned")
        }
    }
}
