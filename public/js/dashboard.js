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
    setActive()
})

$("#nav-connections").click(function (){
    loadComponent("connections")
    setActive("connections")
})

$("#btn-signout").click(function (){
    signOut()
    window.location = "index.html"
})

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