// Holds information about currently signed in user. 
var currentUser = {}

// Listen for change in signed in state. 
auth.onAuthStateChanged(user => {
    if(user){
        getUserInfo(user)

        /*
        // If doctor show medication option. 
        if(user.role == "doctor"){
            $('#nav-meds').removeClass("d-none")
        }
        */
    } else{
        signOut()
        window.location = "index.html"
    }   
})

// Sets default active item in nav bar. 
$(function() {
    setActive("users")
})

function getUserInfo(user){
    db.collection('users').doc(user.uid).get().then(doc =>{
        currentUser = {
            id : user.uid,
            email : user.email,
            name :  doc.data().name,
            role : doc.data().role
        }
        setupUI()
    })
}

function setupUI(){
    $('#topbar-name').html(currentUser.name)
 
    Module.load("Users")
}

function loadModule(module){
    // Gets the location of the element and inserts the module into it. 
    $("#"+module).addClass("active")

    // Loads {module}.html into #module.     
    $("#module").load("modules/" + module)
}

// Sets active nav item in sidebar. 
function setActive(module){
    $("#nav-"+module).addClass("active")

    if(module != "users"){
        $("#nav-users").removeClass("active")
    }
    if(module != "clients"){
        $("#nav-clients").removeClass("active")
    }
    if(module != "admins"){
        $("#nav-admins").removeClass("active")
    }
    if(module != "clients-deactive") {
        $("#nav-clients-deactive").removeClass("active")
    } 
    if(module != "users-deactive"){
        $("#nav-users-deactive").removeClass("active")
    }
    if(module != "meds"){
        $("#nav-meds").removeClass("active")
    }
}

function startLoad(){
    //$('#wrapper').css('filter', 'blur(3px)')
    $('.lds-roller').show()

    // Prevents user interaction with page. 
    $('*').css('pointer-events', 'none')
}

function endLoad(){
    //$('#wrapper').css('filter', '')
    $('.lds-roller').hide()

    // Restores default functionality. 
    $('*').css('pointer-events', 'auto')
}

// Sidebar buttons.
$("#nav-brand").click(function (){
    Module.load("Users")
    setActive("users")
})

$("#nav-users").click(function (){
    Module.load("Users")
    setActive("users")
})

$("#nav-clients").click(function (){
    Module.load("Clients")
    setActive("clients")
})

$("#nav-admins").click(function (){
    Module.load("Admins")
    setActive("admins")
})

$("#nav-clients-deactive").click(function (){
    Module.load("ClientsDeactive")
    setActive("clients-deactive")
})

$("#nav-users-deactive").click(function (){
    Module.load("UsersDeactive")
    setActive("users-deactive")
})

$("#nav-meds").click(function (){
    Module.load("Meds")
    setActive("meds")
})

// Topbar buttons. 
$("#btn-signout").click(function (){
    signOut()
    window.location = "index.html"
})



