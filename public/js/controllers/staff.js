class Staff{
    static load(){
        this.div = "#staff-container"
        this.users = "#users-module"
        this.user = "#user-module"

        // Load html and then submodules. 
        $(`${this.div}`).load('views/staff.html', () => {
            let users = new Users(`${this.div} #users-module`)
            users.externalListeners(this.listeners)
        })
    }

    static listeners(id){
        new User(id, `${Staff.div} #user-module`)
    }
}