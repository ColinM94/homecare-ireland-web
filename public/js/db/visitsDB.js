class VisitsDB{
    static async getVisitIds(id){
        let doc = await db.collection('visits').doc(id).get()
        return doc.data()
    }

    static async getVisitsIds(id) {
     
        let doc = await db.collection('visits').doc(id).get()

        let visitIds = []

        if(doc.exists) visitIds = doc.data().ids 

        let visits = new Array()

        visitIds.forEach(visitId => {
            let visit = this.getVisitDetails(visitId)
            visits.push(visit)
        })

        console.log(visits)
        return visits
     
    }

    static async getVisits(id){
        let doc = await db.collection('visits').doc()
    }

    static async getAllVisits(){
        let visits = new Array()

        let docs = await db.collection('visitDetails').get()

        docs.forEach(doc => {
            let visitId = doc.id
            let clientId = doc.data().clientId
            let userId = doc.data().userId
            let clockInTime = doc.data().clockInTime
            let clockOutTime = doc.data().clockOutTime
            let startTime = doc.data().startTime
            let endTime = doc.data().endTime

            let visit = new Visit(visitId, clientId, userId, clockInTime, clockOutTime, startTime, endTime)

            visits.push(visit)
        })

        return visits
    }

    static async getVisitDetails(id){
        let doc = await db.collection('visitDetails').doc(id).get()

        let visit = new Visit()
        visit.docToVisit(doc)

        return visit
    }

    // Creates new doc in visitDetails. 
    static async addVisit(userId, clientId, startTime, endTime){
        let visitDetails = new Visit(null, clientId, userId, null, null, startTime, endTime)

        await db.collection("visitDetails").add(visitDetails.toFirestore())
            .then(function(docRef) {
                VisitsDB.addVisitId(userId, docRef.id)
                VisitsDB.addVisitId(clientId, docRef.id)
            }).catch(error => {
                Message.display(2, "Error Adding Visit!")
            })
    }

    // Adds {visitId} to visits/{id}/ids array.
    static async addVisitId(id, visitId){
        let doc = await db.collection('visits').doc(id).get()

        let visitIds = []

        if(doc.exists){
            visitIds = doc.data().ids
        }

        visitIds.push(visitId)

        await db.collection("visits").doc(id).set({
            ids: visitIds
        })
    }

    static async deleteVisit(visitId){
        await db.collection('visitDetails').doc(visitId).delete()
            .then(function(docRef) {
                Message.display(1, "Visit Deleted")
            }).catch(error => {
                Message.display(2, "Error Adding Visit!")
            })
    }
}

