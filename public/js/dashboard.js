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
    if(module != "clientsDeactive") {
        $("#clientsDeactive").removeClass("active")
    } 
    if(module != "connections"){
        $("#nav-connections").removeClass("active")
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

$("#navClientsDeactive").click(function (){
    loadModule("clientsDeactive")
})

$("#nav-connections").click(function (){
    loadModule("connections")
})

// Topbar buttons. 
$("#btn-signout").click(function (){
    signOut()
    window.location = "index.html"
})