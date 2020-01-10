class Visit{
    constructor(id, clientId, userId, clockInTime, clockOutTime, startTime, endTime) {
        this.id = id
        this.clientId = clientId
        this.userId = userId
        this.clockInTime = clockInTime
        this.clockOutTime = clockOutTime
        this.startTime = startTime
        this.endTime = endTime
    }

    // Instantiates class with values from firestore document. 
    docToVisit(doc) {
        this.id = doc.id
        this.clientId = doc.data().clientId
        this.userId = doc.data().userId
        this.clockInTime = doc.data().clockInTime
        this.clockOutTime = doc.data().clockOutTime
        this.startTime = doc.data().startTime
        this.endTime = doc.data().endTime
    }

    formatDate(dateString){

    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let visit = {
            clientId : this.clientId,
            userId : this.userId,
            clockInTime : this.clockInTime,
            clockOutTime : this.clockOutTime,
            startTime : this.startTime,
            endTime : this.endTime
        }

        return visit
    }
}