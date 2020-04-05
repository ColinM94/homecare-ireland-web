class MedsView{
    constructor(user){
        this.div = "#meds-view"

        $(this.div).text("")
        $(this.div).append(`
            <div id="meds-module" class="col-12 w-100 module"></div>
            <div id="med-module" class="col-12 w-100 module"></div>
        `)

        if(user.role == "Admin") this.meds = new MedsModule(this, `${this.div} #meds-module`, "", true, true, user)
        else if(user.role == "Carer") this.meds = new MedsModule(this, `${this.div} #meds-module`, "", true, false, user)
    }

    loadMed(id){
        this.medsModule = new MedModule(`${this.div} #med-module`, id)
    }

    handle(data){
        if(data[0] == "med"){
            this.loadMed(data[1].id)
        }
    }
}