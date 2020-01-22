class VisitsDB{
    // Creates new doc in visitDetails. 
    static async addVisit(userId, clientId, startDate, startTime, endDate, endTime){
        let visit = new Visit(null, clientId, userId, "", "", startDate, startTime, endDate, endTime)

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
            let visit = new Visit()   
            visit.docToVisit(doc)
            visits.push(visit)
        })

        return visits
    }

    static async deleteVisits(id){
        let visits = await this.getVisits(id)

        console.log(visits)

        visits.forEach(visit => {
            db.collection('visits').doc(visit.id).delete()
        })
    }

    static async deleteVisit(visitId){
        db.collection('visits').doc(visitId).delete()
    }

    static async getVisit(visitId){
        let doc = await db.collection('visits').doc(visitId).get()
        
        let visit = new Visit()

        visit.docToVisit(doc)

        return visit
    }
}

