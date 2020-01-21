class VisitDetails{
    static overlay = true
    static visitId = null

    static async load(visitId){
        console.log("Visit loaded")
        console.log(visitId)

        this.visitId = visitId

        let visit = await VisitsDB.getVisitDetails(visitId)

        $('#visit-id').text(` ${visit.id}`)
        $('#visit-start').text(` ${visit.startDate} @ ${visit.startTime}`)
        $('#visit-end').text(` ${visit.endDate} @ ${visit.endTime}`)
        $('#visit-clockin').text(` ${visit.clockInTime}`)
        $('#visit-clockout').text(` ${visit.clockOutTime}`)

    }
}