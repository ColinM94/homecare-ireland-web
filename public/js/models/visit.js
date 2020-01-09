class Visit{
    constructor(id, clientId, userId, clockInTime, clockOutTime, startTime, endTime) {
        this.id = id
        this.clientId = this.clientId
        this.userId = this.userId
        this.clockInTime = this.clockInTime
        this.clockOutTime = this.clockOutTime
        this.startTime = this.startTime
        this.endTime = this.endTime
    }

    // Instantiates class with values from firestore document. 
    docToVisit(doc) {
        this.id = doc.id
        this.clientId = doc.data().clientId
        this.userId = doc.data().userId
        this.clockInTime = doc.data().clockInTime
        this.clockOutTime = doc.data().clockOutTime
        this.starttTime = doc.data().startTime
        this.endTime = doc.data().endTime
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let visit = {
            id : this.id,
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