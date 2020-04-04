class VisitModel{
    constructor(id, clientId, userId, clockIn, clockOut, start, end, notes) {
        this.id = id
        this.clientId = clientId
        this.userId = userId
        this.clockIn = clockIn
        this.clockOut = clockOut
        this.start = start
        this.end = end
        this.notes = notes
    }

    // Instantiates class with values from firestore document. 
    docToVisit(doc) {
        this.id = doc.id
        this.clientId = doc.data().clientId
        this.userId = doc.data().userId
        this.clockIn = doc.data().clockIn
        this.clockOut = doc.data().clockOut
        this.start = doc.data().start
        this.end = doc.data().end
        this.notes = doc.data().notes
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let visit = {
            clientId : this.clientId,
            userId : this.userId,
            clockIn : this.clockIn,
            clockOut : this.clockOut,
            start : this.start,
            end : this.end,
            notes : this.notes
        }

        return visit
    }
}