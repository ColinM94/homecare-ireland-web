let currentUser 

// Listen for change in signed in state. 
auth.onAuthStateChanged(user => {
    if(user){
        UsersDB.getUser(user.uid)
            .then(user => {
                Dashboard.load()
                currentUser = user
            })
    }else{
        Auth.signOut()
        Index.load()
    }   
})

class Dashboard{
    static load(){
        $("#main-content").load("views/dashboard.html", () => {
            // Staff.load()
            this.loadView("staff")
            this.div = "#dashboard"
            $('.sidenav-footer-title').text(currentUser.name)
            this.listeners()
            sbAdmin()
        })
    }

    // If view doesn't exist it is created, if it exists it is displayed. 
    static loadView(view){       
        switch(view){
            case "staff":
                if($("#staff-view").text().trim() == "")
                    StaffView.load()
                break
            case "clients":
                if($("#clients-view").text().trim() == "")
                    ClientsView.load()
                break
            case "meds":
                if($("#meds-view").text().trim() == "")
                    MedsView.load()
                break
        }

        $('.view').addClass("d-none")
        $(`#${view}-view`).removeClass("d-none")
        $(".nav-link").removeClass("active")
        $(`#btn-sidebar-${view}`).addClass("active")
    }

    static async signOut(){
        if(await Prompt.confirm("Are you sure you want to sign out?")){
            Auth.signOut()
        }
    }

    static listeners(){
        // $("#sidebarToggle").on("click", function(e) {
        //     e.preventDefault();
        //     $("body").toggleClass("sidenav-toggled")
        // })

        // $(document).on('click', '#sidebarToggle', (ref) => {
        //     Notification.display(1, "Toggled")
        //     $("body").toggleClass("sidenav-toggled")
        // })

        $(document).on('click', '#btn-sidebar-staff', (ref) => {
            this.loadView("staff")
        })

        $(document).on('click', '#btn-sidebar-clients', () => {
            this.loadView("clients")
        })

        $(document).on('click', '#btn-sidebar-medications', () => {
            this.loadView("meds")
        })

        $(document).on('click', '#btn-signout', () => {
            this.signOut()
        })

        $(document).on('click', '#btn-settings', () => {
            $('#modal-settings').modal('show')
        })
    }
}

function loadMed(id){
    $('#medications-module').append(`<div id="medication"></div>`)
    $('#medication').load('views/med-details.html')
    MedDetails.load(id)
}

// function toggleSidebar(){
//     $("body").toggleClass("sidenav-toggled")
// }


// // SB Admin JS //

function sbAdmin(){
    // Enable Bootstrap tooltips via data-attributes globally
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Bootstrap popovers via data-attributes globally
    $('[data-toggle="popover"]').popover();

    $(".popover-dismiss").popover({
        trigger: "focus"
    });

    // // Add active state to sidbar nav links
    // var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    // $("#layoutSidenav_nav .sidenav a.nav-link").each(function() {
    //     if (this.href === path) {
    //     $(this).addClass("active");
    //     }
    // });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sidenav-toggled");
    });

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
        const BOOTSTRAP_LG_WIDTH = 992;
        if (window.innerWidth >= 992) {
        return;
        }
        if ($("body").hasClass("sidenav-toggled")) {
            $("body").toggleClass("sidenav-toggled");
        }
    });

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
    
    // targetAnchor.addClass('active');
    
    collapseAncestors.each(function() {
        $(this).addClass('show');
        $('[data-target="#' + this.id +  '"]').removeClass('collapsed');
        
    })
}
