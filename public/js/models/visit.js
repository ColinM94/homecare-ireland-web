class Visit{
    constructor(id, clientId, userId, clockInTime, clockOutTime, startDate, startTime, endDate, endTime, notes) {
        this.id = id
        this.clientId = clientId
        this.userId = userId
        this.clockInTime = clockInTime
        this.clockOutTime = clockOutTime
        this.startDate = startDate
        this.startTime = startTime
        this.endDate = endDate
        this.endTime = endTime
        this.notes = notes
    }

    // Instantiates class with values from firestore document. 
    docToVisit(doc) {
        this.id = doc.id
        this.clientId = doc.data().clientId
        this.userId = doc.data().userId
        this.clockInTime = doc.data().clockInTime
        this.clockOutTime = doc.data().clockOutTime
        this.startDate = doc.data().startDate
        this.startTime = doc.data().startTime
        this.endDate = doc.data().endDate
        this.endTime = doc.data().endTime
        this.notes = doc.data().notes
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let visit = {
            clientId : this.clientId,
            userId : this.userId,
            clockInTime : this.clockInTime,
            clockOutTime : this.clockOutTime,
            startDate : this.startDate, 
            startTime : this.startTime,
            endDate : this.endDate,
            endTime : this.endTime,
            notes : this.notes
        }

        return visit
    }
}