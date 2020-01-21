class VisitsDB{
    static async getVisitIds(id){
        let doc = await db.collection('visits').doc(id).get()
        return doc.data()
    }

    static async getVisits(id) {
        let doc = await db.collection('visits').doc(id).get()
    console.log(doc.data())
        let visitIds = []

        if(doc.exists) visitIds = doc.data().ids 

        let visits = []

        for(const visitId of visitIds){
            let visit = await this.getVisitDetails(visitId)

            visits.push(visit)
        }

        return visits
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
    static async addVisit(userId, clientId, startDate, startTime, endDate, endTime){
        let visitDetails = new Visit(null, clientId, userId, "", "", startDate, startTime, endDate, endTime)

        let docRef = await db.collection("visitDetails").add(visitDetails.toFirestore())
            .catch(error => {
                Message.display(2, "Error Adding Visit!")
            })

            await VisitsDB.addVisitId(userId, docRef.id)
            await VisitsDB.addVisitId(clientId, docRef.id)
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

    // Updates ids array in DB visits/{id}/ids.
    static async updateVisit(id, data){
        let doc = {
            ids : data
        }

        db.collection('visits').doc(id).set(doc)
    }

    static async deleteVisits(id){
        let visitIds = await this.getVisitIds(id)

        visitIds.forEach(visitId =>{
            
        })
    }

    static async deleteVisit(visitId){
        let doc = await db.collection('visitDetails').doc(visitId).get()

        let visit = doc.data()

        await Promise.all([
            this._deleteVisit(visit.userId, visit.clientId),
            this._deleteVisit(visit.clientId, visit.userId)
        ]).then(() => {
            db.collection('visitDetails').doc(visitId).delete()
        })
    }

    // Deletes id from connections/{fromId}/ids.
    static async _deleteVisit(fromId, toId) {
        let doc = await db.collection('visits').doc(fromId).get()

        let visits = doc.data().ids

        // Removes selected id from array.
        visits.splice(visits.indexOf(toId), 1)

        console.log(visits)

        await this.updateVisit(fromId, visits)
    }
}

