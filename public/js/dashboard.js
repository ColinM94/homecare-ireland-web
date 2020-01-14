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
    Module.load("Users")
})

$("#nav-users").click(function (){
    Module.load("Users")
})

$("#nav-clients").click(function (){
    Module.load("Clients")
})

$("#nav-clients-deactive").click(function (){
    Module.load("ClientsDeactive")
})

$("#nav-users-deactive").click(function (){
    Module.load("UsersDeactive")
})

// Topbar buttons. 
$("#btn-signout").click(function (){
    signOut()
    window.location = "index.html"
})