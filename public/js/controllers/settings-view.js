class SettingsView{
    static load(user){
        this.div = "#settings-view"
        this.user = user

        $(`${this.div}`).load("views/settings.html", () => {
            $(this.div).append('<div id="modal"></div>')
            $(`${this.div} #modal`).load("views/modals/update-user.html")
            this.listeners()
            this.update(user)
            Module.show(this.div)
        })
    }

    static update(user){
        this.user = user

        if(this.user.settings["preserveTabState"]) this.showPreserveState(true)
        else this.showPreserveState(false)
    }

    static togglePreserveState(){
        if(this.user.settings["preserveTabState"]){
            UsersDB.updateSettings(this.user.id, "preserveTabState", false)
        }else{
            UsersDB.updateSettings(this.user.id, "preserveTabState", true)
        }
    }

    static showPreserveState(state){
        if(state == true){
            $('#preserve-icon')
                .removeClass("fa-square")
                .addClass("fa-check-square")
        }else if(state == false){
            $('#preserve-icon')
                .removeClass("fa-check-square")
                .addClass("fa-square")
        }
    }
    
    static listeners(){  
        $(this.div).on('click', '#btn-preserve', (ref) => {
            this.togglePreserveState()
        }) 
        
        $(this.div).on('click', '#btn-account', (ref) => {
            $("#modal-update-user").modal("show")
        })  
    }       
}