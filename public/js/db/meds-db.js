// Interactions with meds collection in DB.
class MedsDB{
    static async observe(){
        let query = db.collection('meds')
        
        query.onSnapshot(querySnapshot => {
                let meds = new Array()

                querySnapshot.forEach(doc => {
                    let med = new Medication()
                    med.docToMed(doc)
                    meds.push(med)
                    Medications.refreshTable()
                })
            }, err => {
                console.log(`Encountered error: ${err}`);
        })
    }

    // Returns array of Conn objects where doc contains user/client id.
    static async getMed(id) {
        let result = await db.collection('meds').doc(id).get()

        let med = new Medication()

        med.docToMed(result)

        return med
    }

    static async getMeds(){
        let result = await db.collection('meds').get()

        let meds = new Array()

        result.forEach(doc => {
            let med = new Medication()   
            med.docToMed(doc)
            meds.push(med)
        })

        return meds
    }

    static async addMed(name, description, sideEffects){
        let med = new Med(null, name, description, sideEffects)

        await db.collection('meds').add(med.toFirestore())
    }

    static async addPresc(){
        
    }

    static async deleteMed(id){
        await db.collection('meds').doc(id).delete()
    }

    static async updateMed(id, name, description, sideEffects){
        let med = new Med(id, name, description, sideEffects)
        await db.collection("meds").doc(id).set(med.toFirestore())
    }
}


    


