// Shared functionality between UserProfile & ClientProfile
class Profile{
    static async deleteConn(connId,){
        if(await Prompt.confirm("This action will delete the connection between carer and client!")){
            await ConnsDB.deleteConn(connId)
                .then(() => {
                    Notification.display(1, "Connection deleted")
                }).catch(error => {
                    Notification.display(2, "Unable to delete connection")
                })
        }
    }

    static async deleteVisit(visitId){
        if(await Prompt.confirm()) {
            await VisitsDB.deleteVisit(visitId)
        }
    }
}

