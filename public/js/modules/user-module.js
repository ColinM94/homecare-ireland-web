class UserModule{
    // div: string = Div id/class to load module into. 
    // userId: string = Id of user to be loaded from db. 
    constructor(div, userId){
        this.div = div

        $(`${this.div}`).load("views/templates/details.html", () => {
            this.listeners()
            this.observe(userId)
        })
    }

    observe(userId){
        let doc = db.collection('users').doc(userId)
        let observer = doc.onSnapshot(docSnapshot => {
            let user = new UserModel()
            user.docToUser(docSnapshot)
            this.displayData(user)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    displayData(user){
        Module.clearDetails(this.div)

        Module.setTitle(this.div, `${user.name}'s Details`)
        
        Module.appendDetail(this.div, "Name", user.name)
        Module.appendDetail(this.div, "Role", user.role)
        Module.appendDetail(this.div, "Gender", user.gender)
        Module.appendDetail(this.div, "Date of Birth", user.dob)
        Module.appendDetail(this.div, "Mobile", user.mobile)

        let address = Format.address(user.address1, user.address2, user.town, user.county, user.eircode)
        Module.appendDetail(this.div, "Address", address)

        Module.appendDetail(this.div, "Archived", Convert.boolToText(user.archived))

        Module.scroll(this.div)
    }

    listeners(){
        // Opens clicked rows user details. 
        $(this.userModule).on('click', '#btn-user-close', (ref) => {
            $(this.div).addClass("d-none")
        })
    }
}
