// Interactions with meds collection in DB.
class MedsDB{
    // Returns array of Conn objects where doc contains user/client id.
    static async getMed(id) {
        let result 
        await db.collection('meds').doc(id).get()
            .then(doc => {
                result = doc
            }).catch(error => {
                Message.display(2, "Error getting med")
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

    static async addMed(name){
        let med = new Med(null, name)

        await db.collection('meds').add(med.toFirestore())
    }

    static async deleteMed(id){
                    console.log(id)
        db.collection('meds').doc(id).delete()
            .then(() => {
                Message.display(1, "Medication deleted")
            }).catch(error => {
                console.log(error.message())
                Message.display(2, "Unable to delete medication")
            })
    }
}


    


