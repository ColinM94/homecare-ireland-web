class MedsView{
    static load(){
        this.div = "#meds-view"

        $(this.div).text("")
        $(this.div).append(`
            <div class="mx-2 mx-sm-4 ">
                <div id="meds-module"></div>
                <div id="med-module"></div>
            </div>
        `)

        View.setTitle(this.div, "Medication")
        View.setIcon(this.div, "fas fa-tablets")

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