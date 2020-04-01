class UserModule{
    // div: string = Div id/class to load module into. 
    // userId: string = Id of user to be loaded from db. 
    // callBack: class reference = Allows for calling functions in view class. 
    constructor(callBack, div, userId){
        this.div = div
        this.userId = userId
        this.callBack = callBack

        $(`${this.div}`).load("views/templates/details.html", () => {

            this.observe(userId)
            this.listeners()
            this.show()
        })
    }

    // Observes DB for changes to this user. 
    observe(){
        let doc = db.collection('users').doc(this.userId)
        let observer = doc.onSnapshot(docSnapshot => {
            let user = new UserModel()
            user.docToUser(docSnapshot)
            this.display(user)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification.display(2, "Problem loading user")
        })
    }

    // Adds user information and buttons. 
    display(user){
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

        // $(`${this.div} .card-body`).append(`<button id="btn-conn" class="btn btn-primary">Assign Client</button>`)

        Module.scroll(this.div)
    }

    
    
    // Internal listners.
    listeners(){
        // Removes previously set listeners to prevent duplication. 
        $(this.div).off('click')

        $(this.div).on('click', `#btn-conn`, () => {
            this.connForm()
        })
    }

    // Makes div visible. 
    show(){
        $(this.div).show()
    }

    // Makes div invisible. 
    hide(){
        $(this.div).hide()
    }
}
