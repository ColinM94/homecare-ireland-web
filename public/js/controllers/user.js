class User{
    constructor(id, div){
        this.div = div
        this.loadData(id)
        $('#user').removeClass("d-none")
        this.listeners()
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
        $('#user-profile-title').text(` ${user.name}`)

        $('#user-profile-id').text(` ${user.id}`)

        if(user.archived) $('#user-profile-archived').text(" Yes")
        else $('#user-profile-archived').text(` No`)

        $('#user-profile-role').text(` ${user.role}`)
        $('#user-profile-name').text(` ${user.name}`)
        $('#user-profile-gender').text(` ${user.gender}`)
        $('#user-profile-mobile').text(` ${user.mobile}`)
        $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)

        new Clients(`${this.div} #user #clients-container`, "Clients", user.id)
    }

    listeners(){
        // Opens clicked rows user details. 
        $(this.div).on('click', '#btn-user-close', (ref) => {
            console.log("Hi")
            $('#user').addClass("d-none")
        })
    }
}