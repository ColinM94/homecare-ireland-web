let nfcId = null

class Android{
    static display(msg){
        Notification.display(1, msg)
    }

    static handle(id){
        if($('#modal-clock').hasClass("show")){
            nfcId = id
            $("#nfc").trigger( "custom", [ "Custom", "Event" ] )

        }else{
            $("#modal-med-description").text("")
            $("#modal-med-dosages").text("")
            $("#modal-med-sides").text("")
    
            MedsDB.getMed(id)
                .then(med => {
                    $("#modal-medication").modal("show")
                    $("#modal-med-title").text(med.name)
                    $("#modal-med-class").text(med.type)
    
                    med.description.forEach(desc => {
                        $("#modal-med-description").append(desc + "<br><br>")
                    })
    
                    med.dosages.forEach(dosage => {
                        $("#modal-med-dosages").append(dosage + "<br><br>")
                    })
    
                    med.sideEffects.forEach(side => {
                        $("#modal-med-sides").append(side + "<br><br>")
                    })
                })
        }
    }

    static showToast(toast){
        try{
            AndroidInterface.showToast(toast)

        }catch(error){
        }
    }

    // // Checks if Android interface exists, if yes then the web app is being displayed inside a webview. 
    // static isWebview(){
    //     try{
    //         AndroidInterface.webView()
    //         this.showToast("Hiiiii")
    //         webview = true
    //         Notification.display(2, "Interface exists")



    //     }catch(error){
    //         webview = false
    //         Notification.display(2, "Interface does not exist")
    //     }
    // }


}