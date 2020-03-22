// Holds information about currently signed in user. 
var currentUser = {}

// Listen for change in signed in state. 
auth.onAuthStateChanged(user => {
    if(user){
        UsersDB.getUser(user.uid)
            .then(user => {
                $('.sidenav-footer-title').text(user.name)
            })

        /*
        // If doctor show medication option. 
        if(user.role == "doctor"){
            $('#nav-meds').removeClass("d-none")
        }
        */
    } else{
        Auth.signOut()
        window.location = "index.html"
    }   
})

$( document ).ready(function() {
    startLoad()

    Promise.all(
    [
        loadClients(), 
        loadUsers(),
        loadMedications(),
    ]).then(() => {
        showModule("users")
        endLoad()
    })
})

function startLoad(){
    $('.lds-roller').show()

    // Prevents user interaction with page. 
    $('*').css('pointer-events', 'none')
}

function endLoad(){
    $('.lds-roller').hide()

    // Restores default functionality. 
    $('*').css('pointer-events', 'auto')
}

// Sets active nav item in sidebar. 
function setActive(module){
    console.log("#btn-sidebar-"+module)
}

function showModule(module){
    $(".nav-link").removeClass("selected")
    $("#btn-sidebar-"+module).addClass("selected")
    $('.module').addClass("d-none")
    $(`#${module}-module`).removeClass("d-none")
}

function loadUsers(){
    $(`#users-module`).load("modules/users.html")
    Users.load()
}

function loadClients(){
    $(`#clients-module`).load("modules/clients.html")
    Clients.load()
}

function loadMedications(){
    $(`#medications-module`).load("modules/medications.html")
    Medications.load()
}

function loadClient(id){
    console.log(id)
    $('#clients-module').append(`<div id="client"></div>`)
    $('#client').load(`modules/clientProfile.html`)
    ClientProfile.load(id)
}

function loadUser(id){
    $('#users-module').append(`<div id="user"></div>`)
    $('#user').load(`modules/userProfile.html`)
    UserProfile.load(id)
}

function loadMed(id){
    $('#medications-module').append(`<div id="medication"></div>`)
    $('#medication').load('modules/medDetails.html')
    MedDetails.load(id)
}

$("#btn-signout").click(function (){
    Auth.signOut()
})

$("#btn-sidebar-users").click(function (){
    showModule("users")
})

$("#btn-sidebar-clients").click(function (){
    showModule("clients")
})

$("#btn-sidebar-medications").click(function (){
    showModule("medications")
})

$("#btn-sidebar-dashboard").click(function (){
    $('.module').removeClass("d-none")
})