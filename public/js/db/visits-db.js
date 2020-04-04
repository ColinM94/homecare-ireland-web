class VisitsDB{
    // Creates new doc in visitDetails. 
    static async addVisit(userId, clientId, start, end, notes){
        let visit = new VisitModel(null, clientId, userId, "", "", start, end, notes)

        await db.collection("visits").add(visit.toFirestore())
    }

    // Returns array of Visits objects containing user/client {id} from visitDetails collection.
    static async getVisits(id) {
        let docs 

        // If {id} length > 20 then it is a userId else clientId.
        if(id.length > 20){
            docs = await db.collection('visits').where('userId', '==', id).get()
        }else{
            docs = await db.collection('visits').where('clientId', '==', id).get()
        }

        let visits = []

        docs.forEach(doc => {
            let visit = new VisitModel()   
            visit.docToVisit(doc)
            visits.push(visit)
        })

        return visits
    }

    static async addNote(visit, note){
        let notes = visit.notes
        notes.push(note)
        

        await db.collection("visits").doc(visit.id).set({"notes": notes}, {merge:true})
    }

    static async deleteNote(visit, index){
        let notes = visit.notes

        // Splice won't work on single element array, so add empty array to DB. 
        if(notes.length <= 1){
            notes = []
        }else{
            notes.splice(index, 1)
        }

        await db.collection("visits").doc(visit.id).set({"notes": notes}, {merge:true})
    }

    static async updateVisit(visit){
        db.collection("visits").doc(visit.id).set(visit, SetOptions.merge())
    }

    static async deleteVisits(id){
        let visits = await this.getVisits(id)

        visits.forEach(visit => {
            db.collection('visits').doc(visit.id).delete()
        })
    }

    static async deleteVisit(visitId){
        db.collection('visits').doc(visitId).delete()
    }

    static async getVisit(visitId){
        let doc = await db.collection('visits').doc(visitId).get()
        
        let visit = new VisitModel()

        visit.docToVisit(doc)

        return visit
    }
}

