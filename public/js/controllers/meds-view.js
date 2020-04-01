class MedsView{
    constructor(){
        this.div = "#meds-view"

        $(this.div).text("")
        $(this.div).append(`
            <div id="meds-module" class="col-12 w-100 module"></div>
            <div id="med-module" class="col-12 w-100 module"></div>
        `)

        this.meds = new MedsModule(this, `${this.div} #meds-module`, "", true, true)
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