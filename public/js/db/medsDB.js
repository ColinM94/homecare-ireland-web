// Interactions with meds collection in DB.
class MedsDB{
    // Returns array of Conn objects where doc contains user/client id.
    static async getMed(id) {
        let result 
        await db.collection('meds').doc(id).get()
            .then(doc => {
                result = doc
            }).catch(error => {
                Notification.display(2, "Error getting med")
            })

            let med = new Med()

            med.docToClient(result)

            return med
    }

    static async getMeds(){
        let result = await db.collection('meds').get()

        let meds = new Array()

        result.forEach(doc => {
            let med = new Med()   
            med.docToClient(doc)
            meds.push(med)
        })

        return meds
    }

    static async addMed(name, description, sideEffects){
        let med = new Med(null, name, description, sideEffects)

        await db.collection('meds').add(med.toFirestore())
    }

    static async deleteMed(id){
        await db.collection('meds').doc(id).delete()
    }
}


    


