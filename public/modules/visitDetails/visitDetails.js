class VisitDetails{
    static overlay = true
    static visit = null
    static visitId = null

    static async load(visitId){
        this.visitId = visitId
        await this.refresh()

        $('#visit-id').text(` ${this.visit.id}`)
        $('#visit-start').text(` ${this.visit.startDate} @ ${this.visit.startTime}`)
        $('#visit-end').text(` ${this.visit.endDate} @ ${this.visit.endTime}`)
        $('#visit-clockin').text(` ${this.visit.clockInTime}`)
        $('#visit-clockout').text(` ${this.visit.clockOutTime}`)

        let user = await UsersDB.getUser(this.visit.userId)
        let client = await ClientsDB.getClient(this.visit.clientId)

        $('#visit-user').append(`<a href="javascript:Module.load('UserProfile', '${user.id}')">${user.name}</a><br>`)
        $('#visit-client').append(`<a href="javascript:Module.load('ClientProfile', '${client.id}')">${client.name}</a><br>`)

        this.listeners()
    }

    static async refresh(){
        // Clears notes. 
        $("#visit-notes").html("")

        this.visit = await VisitsDB.getVisit(this.visitId)

        let counter = 0
        this.visit.notes.forEach(note => {
            $('#visit-notes').append(` ${note} <a href="javascript:VisitDetails.deleteNote('${counter}')" style="color:red;">[X]</a><br>`)
            counter++
        })
    }

    static async addNote(){
        let note = $('#visit-new-note').val()

        await VisitsDB.addNote(this.visit, note)

        this.refresh()
    }

    static async deleteNote(index){
        if(await Prompt.confirm()){
            await VisitsDB.deleteNote(this.visit, index)

            this.refresh()
        }
    }

    // Instantiate listeners. 
    static async listeners() {
        $('#btn-close-visit-details').click(function(){
            Module.closeOverlay()
        })

        $('#btn-visit-add-note').click(function(){
            VisitDetails.addNote()
        })     
    }
}