class UserProfile{
    static overlay = true
    static userId = null

    static async load(userId){
        this.userId = userId

        let user = await UsersDB.getUser(userId)

        $('#user-profile-title').text(` ${user.name}`)

        $('#user-profile-id').text(` ${user.id}`)
        $('#user-profile-role').text(` ${user.role}`)
        $('#user-profile-name').text(` ${user.name}`)
        $('#user-profile-mobile').text(` ${user.mobile}`)
        $('#user-profile-address').text(` ${user.address1}, ${user.address2}, ${user.town}, ${user.county}, ${user.eircode}`)

        this.listeners()
    }   

    static listeners(){
        $('#btn-user-profile-close').click(function(){
            
            $('#userProfile').hide()
        })
    }
}