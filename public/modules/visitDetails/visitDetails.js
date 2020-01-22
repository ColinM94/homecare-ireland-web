class VisitDetails{
    static overlay = true
    static visitId = null

    static async load(visitId){
        this.visitId = visitId

        let visit = await VisitsDB.getVisit(visitId)

    console.log(visit)
        $('#visit-id').text(` ${visit.id}`)
        $('#visit-start').text(` ${visit.startDate} @ ${visit.startTime}`)
        $('#visit-end').text(` ${visit.endDate} @ ${visit.endTime}`)
        $('#visit-clockin').text(` ${visit.clockInTime}`)
        $('#visit-clockout').text(` ${visit.clockOutTime}`)

        let user = await UsersDB.getUser(visit.userId)
        let client = await ClientsDB.getClient(visit.clientId)

        $('#visit-user').append(`<a href="javascript:Module.load('UserProfile', '${user.id}')">${user.name}</a><br>`)
        $('#visit-client').append(`<a href="javascript:Module.load('ClientProfile', '${client.id}')">${client.name}</a><br>`)

        this.listeners()
    }

    // Instantiate listeners. 
    static async listeners() {
        $('#btn-close-visit-details').click(function(){
            Module.closeOverlay()
        })
    }
}