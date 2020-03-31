class MedsView{
    static load(){
        this.div = "#meds-view"

        $(this.div).text("")
        $(this.div).append(`
            <div id="meds-module" class="col-12 w-100 module"></div>
            <div id="med-module" class="col-12 w-100 module"></div>
        `)

        let meds = new MedsModule(`${this.div} #meds-module`)
        meds.listen(this.listener)
}

    static loadMed(id){
        new MedModule(`${MedsView.div} #med-module`, id)
        $('#med-module').show()
    }

    static listener(data){
        if(data[0] == "med"){
            MedsView.loadMed(data[1].id)
        }
    }
}