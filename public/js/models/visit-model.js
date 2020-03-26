class VisitModel{
    constructor(id, clientId, userId, clockInTime, clockOutTime, start, end, notes) {
        this.id = id
        this.clientId = clientId
        this.userId = userId
        this.clockInTime = clockInTime
        this.clockOutTime = clockOutTime
        this.start = start
        this.end = end
        this.notes = notes
    }

    // Instantiates class with values from firestore document. 
    docToVisit(doc) {
        this.id = doc.id
        this.clientId = doc.data().clientId
        this.userId = doc.data().userId
        this.clockInTime = doc.data().clockInTime
        this.clockOutTime = doc.data().clockOutTime
        this.start = doc.data().start
        this.end = doc.data().end
        this.notes = doc.data().notes
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let visit = {
            clientId : this.clientId,
            userId : this.userId,
            clockInTime : this.clockInTime,
            clockOutTime : this.clockOutTime,
            start : this.start,
            end : this.end,
            notes : this.notes
        }

        return visit
    }
}