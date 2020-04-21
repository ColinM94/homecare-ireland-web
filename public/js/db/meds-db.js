// Interactions with meds collection in DB.
class MedsDB{
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
            let med = new MedModel()   
            med.docToMed(doc)
            meds.push(med)
        })

        return meds
    }

    static async addMed(name, type, description, dosages, sideEffects){
        let med = new MedModel(null, name, type, description, dosages, sideEffects)
        console.log(med)
        await db.collection('meds').add(med.toFirestore())
    }

    static async addPresc(){
        
    }

    // static updateMed(id, name, type, description, dosages, sideEffects){
    //     db.collection("meds").doc(id).update({
    //         name: name,
    //         type: type, 
    //         description : description,
    //         dosages: dosages, 
    //         sideEffects: sideEffects
    //     })
    // }

    static async deleteMed(id){
        await db.collection('meds').doc(id).delete()
    }

    static async updateMed(id, name, type, description, dosages, sideEffects){
        console.log(id)
        let med = new MedModel(id, name, type, description, dosages, sideEffects)
        console.log(med)
        await db.collection("meds").doc(id).set(med.toFirestore())
    }
}


    


