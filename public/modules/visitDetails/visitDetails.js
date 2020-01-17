class VisitDetails{
    static overlay = true
    static visitId = null

    static async load(visitId){
        console.log("Visit loaded")
        console.log(visitId)

        this.visitId = visitId

        let visit = await VisitsDB.getVisitDetails(visitId)

        $('#visit-id').text(` ${visit.id}`)
        $('#visit-starttime').text(` ${visit.startTime}`)
        $('#visit-endtime').text(` ${visit.endTime}`)
        $('#visit-clockintime').text(` ${visit.clockInTime}`)
        $('#visit-clockouttime').text(` ${visit.clockOutTime}`)

    }
}