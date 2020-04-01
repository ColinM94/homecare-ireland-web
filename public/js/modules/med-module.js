class MedModule{
    constructor(div, id){
        this.div = div
       
        $(`${this.div}`).load("views/med.html", () => {
            this.loadData(id)
            this.listeners()
            this.show()
        })
    }

    loadData(id){
        let doc = db.collection('meds').doc(id)
        
        let observer = doc.onSnapshot(docSnapshot => {
            let med = new MedModel()
            med.docToMed(docSnapshot)
            this.displayData(med)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    displayData(med){
        $(`${this.div} #med-title`).text("")
        $(`${this.div} #med-desc`).text("")
        $(`${this.div} #med-sides`).text("")


        $(`${this.div} #title`).text(`${med.name}`)

        med.description.forEach(desc => {
            $(`${this.div} #med-desc`).append(desc + "<br><br>")
        }) 

        med.sideEffects.forEach(side => {
            $(`${this.div} #med-sides`).append(side + "<br>")
        })  

        Module.scroll(this.div)
    }

    listeners(){

    }

    show(){
        $(this.div).show()
    }

    hide(){
        $(this.div).hide()
    }
}