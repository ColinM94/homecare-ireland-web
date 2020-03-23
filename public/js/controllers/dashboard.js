// Holds information about currently signed in user. 
var currentUser = {}

var mobile = false


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
    // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //     mobile = true
    // }

    if(screen.width < 750)
        mobile = true;

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

var el = document.getElementById('layoutSidenav_content');
swipedetect(el, function(swipedir){
    // swipedir contains either "none", "left", "right", "top", or "down"
    // Notification.display(1, "Swiped " + swipedir)
    // el.innerHTML = 'Swiped <span style="color:yellow;margin: 0 5px;">' + swipedir +'</span>';
    if(swipedir == "right")
        $("body").addClass("sidenav-toggled")
    else if(swipedir == "left")
        $("body").removeClass("sidenav-toggled")

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

// // Sets active nav item in sidebar. 
// function setActive(module){
//     console.log("#btn-sidebar-"+module)
// }

function showModule(module){    
    $(".nav-link").removeClass("selected")
    $("#btn-sidebar-"+module).addClass("selected")
    $('.module').addClass("d-none")
    $(`#${module}-module`).removeClass("d-none")
}

function loadUsers(){
    startLoad()
    $(`#user-list-module`).load("views/users.html")
    Users.load().then(() => { endLoad()})
}

function loadClients(){
    $(`#client-list-module`).load("views/clients.html")
    Clients.load()
}

function loadMedications(){
    $(`#medications-module`).load("views/medications.html")
    Medications.load()
}

function loadClient(id){
    $('#client-profile-module').load(`views/client-profile.html`)
    ClientProfile.load(id)
}

function loadUser(id){
    $('#user-profile-module').load(`views/user-profile.html`)
    UserProfile.load(id)
}

function loadMed(id){
    $('#medications-module').append(`<div id="medication"></div>`)
    $('#medication').load('views/med-details.html')
    MedDetails.load(id)
}

function toggleSidebar(){
    $("body").toggleClass("sidenav-toggled")
}

// Toggle the side navigation
$("#sidebarToggle").click(function (){
    toggleSidebar()
})

$("#btn-signout").click(function (){
    Auth.signOut()
})

// $(window).resize(function () {
//     $("table").resize();
// });


$("#btn-sidebar-users").click(function (){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        console.log("ANDROID")
    }else{
        console.log("NOT ANDROID")
    }
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

//USAGE:

// let el = $('#layoutSidenav_content')





// SB Admin JS

// Enable Bootstrap tooltips via data-attributes globally
$('[data-toggle="tooltip"]').tooltip();

// Enable Bootstrap popovers via data-attributes globally
$('[data-toggle="popover"]').popover();

$(".popover-dismiss").popover({
trigger: "focus"
});

// Add active state to sidbar nav links
var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
$("#layoutSidenav_nav .sidenav a.nav-link").each(function() {
if (this.href === path) {
    $(this).addClass("active");
}
});

// // Toggle the side navigation
// $("#sidebarToggle").on("click", function(e) {
// e.preventDefault();
// $("body").toggleClass("sidenav-toggled");
// });

// Activate Feather icons
feather.replace();

// Activate Bootstrap scrollspy for the sticky nav component
$("body").scrollspy({
target: "#stickyNav",
offset: 82
});

// Scrolls to an offset anchor when a sticky nav link is clicked
$('.nav-sticky a.nav-link[href*="#"]:not([href="#"])').click(function() {
if (
    location.pathname.replace(/^\//, "") ==
    this.pathname.replace(/^\//, "") &&
    location.hostname == this.hostname
) {
    var target = $(this.hash);
    target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
    if (target.length) {
    $("html, body").animate(
        {
        scrollTop: target.offset().top - 81
        },
        200
    );
    return false;
    }
}
});

// Click to collapse responsive sidebar
$("#layoutSidenav_content").click(function() {
    if (window.innerWidth < 750) {
        if ($("body").hasClass("sidenav-toggled")) {
            $("body").toggleClass("sidenav-toggled");
        }
    }
})

// Init sidebar
let activatedPath = window.location.pathname.match(/([\w-]+\.html)/, '$1');

if (activatedPath) {
activatedPath = activatedPath[0];
}
else {
activatedPath = 'index.html';
}

let targetAnchor = $('[href="' + activatedPath + '"]');
let collapseAncestors = targetAnchor.parents('.collapse');

targetAnchor.addClass('active');

collapseAncestors.each(function() {
$(this).addClass('show');
$('[data-target="#' + this.id +  '"]').removeClass('collapsed');
    
})