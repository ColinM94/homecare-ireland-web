class UserModule{
    // div: string = Div id/class to load module into. 
    // userId: string = Id of user to be loaded from db. 
    // callBack: class reference = Allows for calling functions in view class. 
    constructor(callBack, div, userId, title, error, client){
        this.div = div
        this.userId = userId
        this.callBack = callBack
        this.client = client

        $(`${this.div}`).load("views/templates/details.html", () => {
            $(`${this.div} #title`).text(title)
            if(title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")

            if(error){
                $(`${div} #btn-add`).removeClass("d-none")
                $(`${div} .card-body`).append(`
                <div class="row">
                    <div class="col">
                        <span class="font-weight-bold">${error}</span>
                    </div>
                </div>`)

                Module.createForm(this.div, "#add-kin", "Next of Kin", "Add Kin")
            }else{
                this.observe(userId)
            }


            this.listeners()
            Module.show(this.div)
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

        // Module.setTitle(this.div, `${user.name}'s Details`)
        
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

    addKinForm(){
        let formId = `#add-kin`

        $(formId).text("")

        UsersDB.getUsers("active", "client")
            .then(kin => {
                let options = new Array()
                let arrayCounter = 0

                kin.forEach(user => {
                    if(user.kinId == undefined || user.kinId == ""){
                        options[user.id] = user.name
                        arrayCounter++
                    }        
                })

                Module.addField(formId, "select", "kin", "Select Kin", options)

                if(arrayCounter == 0){
                    $(`${this.div} #add-kin #kin`)
                    .empty()
                    .append(new Option('No Kin Found!'))
                    .attr('disabled', true)
    
                $(`${this.div} #btn-add-kin`).attr('disabled', true)
                }
            })

        $("#add-kin-modal").modal("show")
    }

    async addKin(){
        let userId = $(`${this.div} #add-kin #kin`).val()

        await Promise.all([
            await ClientsDB.updateKin(this.client.id, userId),
            await UsersDB.updateKin(userId, this.client.id)
        ]).then(() => {
            $("#add-kin-modal").modal("hide")
        })
    }       

    removeKin(){
        
    }
    
    // Internal listners.
    listeners(){
        // Removes previously set listeners to prevent duplication. 
        $(this.div).off('click')

        $(this.div).on('click', `#btn-conn`, () => {
            this.connForm()
        })

        $(this.div).on('click', `#btn-add-kin`, () => {
            this.addKin()
        })

        $(this.div).on('click', `#btn-add`, () => {
            this.addKinForm()
        })
    }
}
