class Message{
    static display(type, message){   
        switch(type){
            case 1:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#6BBD6E')
                break
            case 2:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#F66459')
                break
            case 3:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#47A8F5')
                break
            case 4:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#FFAA2C')
            break
        }

        $('#alert-box').css('display', 'block')

        $('#btn-close-msg').click(function(){
            $('#alert-box').css('display', 'none')
        })

        this.fadeOut()
    }

    // Fades out message box after timer. 
    static fadeOut(){
        $("#alert-box").delay(10000).fadeOut()
    }
}

// Listen for auth state change.
auth.onAuthStateChanged(user => {
    if(user){
        getUserInfo(user)
    } else{
        signOut()
        window.location = "index.html"
    }   
})

var currentUser = {}

function getUserInfo(user){
    db.collection('users').doc(user.uid).get().then(doc =>{
        currentUser = {
            id : user.uid,
            email : user.email,
            name :  doc.data().name
        }
        setupUI()
    })
}

function setupUI(){
    $('#topbar-name').html(currentUser.name) 
    loadModule("users")
}

function loadModule(module){
    // Gets the location of the element and inserts the module into it. 
    $("#"+module).addClass("active")
    $("#module").load("modules/" + module)
    setActive(module)
}

// Sets active nav item in sidebar. 
function setActive(module){
    // Default
    $("#nav-"+module).addClass("active")

    if(module != "users"){
        $("#nav-users").removeClass("active")
    }
    if(module != "clients"){
        $("#nav-clients").removeClass("active")
    }
    if(module != "clients-deactive") {
        $("#nav-clients-deactive").removeClass("active")
    } 
    if(module != "users-deactive"){
        $("#nav-users-deactive").removeClass("active")
    }
}

// Sidebar buttons.
$("#nav-brand").click(function (){
    loadModule("users")
})

$("#nav-users").click(function (){
    loadModule("users")
})

$("#nav-clients").click(function (){
    loadModule("clients")
})

$("#nav-clients-deactive").click(function (){
    loadModule("clientsDeactive")
})

$("#nav-users-deactive").click(function (){
    loadModule("usersDeactive")
})

$("#nav-connections").click(function (){
    loadModule("connections")
})

// Topbar buttons. 
$("#btn-signout").click(function (){
    signOut()
    window.location = "index.html"
})