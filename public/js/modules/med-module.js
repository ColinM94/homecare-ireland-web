class MedModule{
    constructor(div, id){
        this.div = div
console.log(id)
        $(`${this.div}`).load("views/med.html", () => {
            this.loadData(id)
            this.listeners()
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
        $(`${this.div} #med-name`).text("")
        $(`${this.div} #med-desc`).text("")
        $(`${this.div} #med-sides`).text("")


        $(`${this.div} #med-name`).text(`${med.name}`)

        med.description.forEach(desc => {
            $(`${this.div} #med-desc`).append(desc + "</br></br>")
        }) 

        med.sideEffects.forEach(side => {
            $(`${this.div} #med-sides`).append(side + "</br></br>")
        })  
    }

    listeners(){

    }
}