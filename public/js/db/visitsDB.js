class VisitsDB{
    static async getVisits(id) {
        let doc = await db.collection('visits').doc(id).get()

        let visitIds = doc.data().ids 

        let visits = new Array()

        visitIds.forEach(visitId => {
            let visit = this.getVisitDetails(visitId)
            visits.push(visit)
        })

        console.log(visits)
        return visits
    }

    static async getVisitDetails(id){
        let doc = await db.collection('visitDetails').doc(id).get()

        let visit = new Visit()
        visit.docToVisit(doc)

        return visit
    }
}