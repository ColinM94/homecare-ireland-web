class UserModule{
    constructor(div, id){
        this.div = div

        $(`${this.div}`).load("views/templates/details.html", () => {
            this.listeners()
            let db = new UsersDB()
            db.listenUser(UserModule.displayData, id, this.div)
        })
    }

    static displayData(user, div){
        Module.clearDetails(div)

        Module.appendDetail(div, "Name", user.name)
        Module.appendDetail(div, "Role", user.role)
        Module.appendDetail(div, "Gender", user.gender)
        Module.appendDetail(div, "Date of Birth", user.dob)
        Module.appendDetail(div, "Mobile", user.mobile)

        let address = Format.address(user.address1, user.address2, user.town, user.county, user.eircode)
        Module.appendDetail(div, "Address", address)

        Module.appendDetail(div, "Archived", Convert.boolToText(user.archived))

        Module.scroll(div)
    }

    listeners(){
        // Opens clicked rows user details. 
        $(this.userModule).on('click', '#btn-user-close', (ref) => {
            $(this.div).addClass("d-none")
        })
    }
}
