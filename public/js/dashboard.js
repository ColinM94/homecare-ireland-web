// Listen for auth state change.
auth.onAuthStateChanged(user => {
    if(user){
        //window.location = "dashboard.html";
        //getUserInfo(user)
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
    document.getElementById("topbar-name").innerHTML = currentUser.name  
}

// Sets active nav item in sidebar. 
function setActive(item){
    // Default
    $("#nav-users").addClass("active")

    if(item != "users"){
        $("#nav-users").removeClass("active")
    }
}

function loadComponent(component){
    // Gets the location of the element and inserts the component into it. 
    $("#"+component).addClass("active")
    $("#component").load("components/" + component)
}

// Sidebar buttons. 
$( document ).ready(function() {
    loadComponent("users")
    setActive("users")
})

$("#nav-brand").click(function (){
    loadComponent("users")
    setActive("users")
})

$("#nav-users").click(function (){
    loadComponent("users")
    setActive("users")
})

$("#nav-clients").click(function (){
    loadComponent("clients")
    setActive("clients")
})

$("#nav-connections").click(function (){
    loadComponent("connections")
    setActive("connections")
})

// Topbar buttons. 
$("#btn-signout").click(function (){
    signOut()
    window.location = "index.html"
})