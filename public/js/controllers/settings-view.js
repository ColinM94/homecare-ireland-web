class SettingsView{
    static load(user){
        this.div = "#settings-view"
        this.user = user

        $(`${this.div}`).load("views/settings.html", () => {
            this.listeners()
            this.update(user)
            this.createFormPersonal()
            this.createFormAddress()

            Module.show(this.div)
        })
    }

    static createFormPersonal(){
        let formId = `#update-user-details`

        Module.createForm(this.div, formId, "Personal Details", "Update")

        Module.addField(formId, "text", "name", "Name")
        Module.addField(formId, "date", "dob", "DOB")
        Module.addField(formId, "select", "gender", "Gender", {"male": "Male", "female": "Female"})
        Module.addField(formId, "text", "mobile", "Mobile")
        // Module.addHR(formId)

        // Module.addHR(formId)
        // Module.addField(this.div, formDiv, "text", "address1", "Address 1")
        // Module.addField(this.div, formDiv, "text", "address1", "Address 1")
        // Module.addField(this.div, formDiv, "text", "address1", "Address 1")

    }

    static createFormAddress(){
        let formId = `#update-user-address`

        Module.createForm(this.div, formId, "Address", "Update")
        
        Module.addField(formId, "text", "address1", "Address 1")
        Module.addField(formId, "text", "address2", "Address 2")
        Module.addField(formId, "text", "town", "Town")
        Module.addField(formId, "select", "county", "County", 
        {"Carlow":"Carlow", "Cavan":"Cavan", "Clare":"Clare", "Cork":"Cork", "Donegal":"Donegal", "Dublin":"Dublin","Galway":"Galway", 
        "Kerry":"Kerry", "Kildare":"Kildare", "Kilkenny":"Kilkenny", "Laois":"Laois", "Leitrim":"Leitrim", "Limerick":"Limerick", 
        "Longford":"Longford", "Louth":"Louth", "Mayo":"Mayo", "Meath":"Meath", "Monaghan":"Monaghan", "Offaly":"Offaly", "Roscommon":"Roscommon", 
        "Sligo":"Sligo", "Tipperary":"Tipperary", "Waterford":"Waterford", "Westmeath":"Westmeath", "Wexford":"Wexford", "Wicklow":"Wexford"})
        Module.addField(formId, "text", "eircode", "Eircode")
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

    static updateDetailsForm(){
        console.log(currentUser)
        $("#update-user-details-modal").modal("show")

        $(`#update-user-details #name`).val(currentUser.name)
        $(`#update-user-details #dob`).val(Convert.tsToDate(currentUser.dob))
        $(`#update-user-details #gender`).val(currentUser.gender)
        $(`#update-user-details #mobile`).val(currentUser.mobile)    
    }

    static updateDetails(){
        let name = $(`#update-user-details #name`).val()
        let dob = Convert.dateToTs($(`#update-user-details #dob`).val())
        let gender = $(`#update-user-details #gender`).val()
        let mobile = $(`#update-user-details #mobile`).val()

        if(!name){
            Notification.formError("Please enter a name!")
        }

        else if(!dob){
            Notification.formError("Please enter a date of birth!")
        }else if(Date.now() < dob){
            Notification.formError("I don't think you were born in the future")
        }

        else if(!gender){
            Notification.formError("Please select a gender!")
        }

        else if(!mobile){
            Notification.formError("Please enter a mobile!")
        }else if(!Validate.mobile(mobile)){
            Notification.formError("Invalid mobile format!")
        }

        else{
            Notification.formError("")

            UsersDB.updateDetails(currentUser.id, name, dob, gender, mobile)
                .then(() => {
                    Notification.display(1, "Changes saved")
                    $("#update-user-details-modal").modal("hide")
                }).catch(error => {
                    console.log(error.message)
                })
        }
    }

    static updateAddressForm(){
        $("#update-user-address-modal").modal("show")

        $(`#update-user-address #address1`).val(currentUser.address1)
        $(`#update-user-address #address2`).val(currentUser.address2)
        $(`#update-user-address #town`).val(currentUser.town)
        $(`#update-user-address #county`).val(currentUser.county)
        $(`#update-user-address #eircode`).val(currentUser.eircode)

    }

    static updateAddress(){
        let address1 = $(`#update-user-address #address1`).val()
        let address2 = $(`#update-user-address #address2`).val()
        let town = $(`#update-user-address #town`).val()
        let county = $(`#update-user-address #county`).val()
        let eircode = $(`#update-user-address #eircode`).val()

        if(!address1){
            Notification.formError("Please enter address1!")
        }

        else if(!town){
            Notification.formError("Please enter town!")
        }

        else if(!county){
            Notification.formError("Please enter county!")
        }

        else if(!eircode){
            Notification.formError("Please enter eircode!")
        }else if(!Validate.eircode(eircode)){
            Notification.formError("Invalid eircode!")
        }

        else{
            Notification.formError("")

            UsersDB.updateAddress(currentUser.id, address1, address2, town, county, eircode)
            .then(() => {
                Notification.display(1, "Changes saved")
                $("#update-user-address-modal").modal("hide")
            }).catch(error => {
                console.log(error.message)
            })
        }
    }
    
    static listeners(){  
        $(this.div).on('click', '#btn-preserve', (ref) => {
            this.togglePreserveState()
        }) 
        
        $(this.div).on('click', '#btn-details', (ref) => {
            this.updateDetailsForm()
        })  

        $(this.div).on('click', '#btn-address', (ref) => {
            this.updateAddressForm()
        })  

        $(this.div).on('click', '#btn-update-user-address', (ref) => {
            this.updateAddress()
        })

        $(this.div).on('click', '#btn-update-user-details', (ref) => {
            this.updateDetails()
        })  
    }       
}