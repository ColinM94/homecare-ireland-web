class User{
    constructor(id, div){
        this.div = div

        // Sub module locations. 
        this.userModule = `${div} #user-module` 
        this.clientsModule = `${div} #clients-module` 
        this.visitsModule = `${div} #visits-module` 

        $(`${this.div}`).load("modules/user/user.html", () => {
            this.loadData(id)
            this.listeners()

            $(this.div).removeClass("d-none")

            new Clients(`${this.div} #clients-module`, id)        
            new Visits(`${this.div} #visits-module`, id)
        })
    }

    loadData(id){
        let doc = db.collection('users').doc(id)
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
        $(`${this.div} #user-profile-title`).text(` ${user.name}`)

        $('#user-profile-id').text(` ${user.id}`)

        if(user.archived) $('#user-profile-archived').text(" Yes")
        else $('#user-profile-archived').text(` No`)

        $('#user-profile-role').text(` ${user.role}`)
        $('#user-profile-name').text(` ${user.name}`)
        $('#user-profile-gender').text(` ${user.gender}`)
        $('#user-profile-mobile').text(` ${user.mobile}`)
        $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)
    }

    listeners(){
        // Opens clicked rows user details. 
        $(this.userModule).on('click', '#btn-user-close', (ref) => {
            $(this.div).addClass("d-none")
        })
    }
}