let currentUser 

// Listen for change in signed in state. 
auth.onAuthStateChanged(user => {
    if(user){
        UsersDB.getUser(user.uid)
            .then(user => {
                currentUser = user

                if(currentUser.archived == false){
                    observe(user.id)
                    Dashboard.load()
                }
            })
    }else{
        Auth.signOut()
    }   
})

// Observes DB for changes to this user. 
function observe(userId){
    // showAndroidToast("Hello from webview")

    let doc = db.collection('users').doc(userId)
    doc.onSnapshot(docSnapshot => {
        let user = new UserModel()
        user.docToUser(docSnapshot)
        currentUser = user
        SettingsView.update(user)
        Dashboard.preserveState = user.settings["preserveTabState"]
        // Dashboard.preserveState = user.settings["preserveTabState"]
    }, err => {
        console.log(`Encountered error: ${err}`)
        Notification.display(2, "Problem loading user")
    })
}

let webview = false
function setWebView() { webView = true } // Tells the web app that it is being displayed in an Android WebView

class Dashboard{
    static load(){
        $("#main-content").load("views/dashboard.html", () => {
            SettingsView.load(currentUser)
            // Preserves state of tabs so you can return to where you left off. 
            // this.preserveState = false

            // $(`#modals`).load("views/modals.html")

            $('.sidenav-footer-title').text(`${currentUser.name} (${currentUser.role})`)

            if(currentUser.role == "Carer"){
                Dashboard.addLink("visits", "fas fa-th-list", "Visits", true, true)
                Dashboard.addLink("clients", "fas fa-users", "Clients", true, true)
                Dashboard.addLink("meds", "fas fa-tablets", "Medication", true, true)
                this.loadView("visits")
            }else if(currentUser.role == "Admin"){
                Dashboard.addLink("staff", "fas fa-user-md", "Users", true, true)
                Dashboard.addLink("clients", "fas fa-users", "Clients", true, true)
                Dashboard.addLink("meds", "fas fa-tablets", "Medication", true, true)
                this.loadView("staff")
            }else if(currentUser.role == "Doctor"){
                Dashboard.addLink("clients", "fas fa-users", "Clients", true, true)
                Dashboard.addLink("meds", "fas fa-tablets", "Medication", true, true)            
            }else if(currentUser.role == "Client"){
                Dashboard.addLink("client", "fas fa-user", "Next of Kin", true, true)
                Dashboard.addLink("meds", "fas fa-tablets", "Medication", true, true)
                this.loadView("client")
            }

            Dashboard.addLink("settings", "fas fa-cog", "Settings", true, true)
            Dashboard.addLink("signout", "fas fa-sign-out-alt", "Sign Out", true, false)

            this.listeners()


            //  sbAdmin()
        })
    }

    static addLink(id, icon, text, web, mobile){
        if(web){
            $('#side-nav .nav-btns').append(`
                <button id="btn-nav-${id}" class="nav-btn w-100 bg-transparent mb-2 border-0 text-left pl-4 row">
                    <i class="${icon} fa-lg col-3 my-auto"></i>
                    <span class="col-9">${text}</span>
                </button>
            `)
        }

        if(mobile){
            $('#bottom-nav').append(`
                <button id="btn-nav-${id}" class="btn nav-btn row col p-0 h-100" href="#">
                    <i class="${icon} fa-lg col-12"></i>
                    <span class="col-12 mt-2 d-none">${text}</span>
                </button>
            `)
        }
    }

    // If view doesn't exist it is created, if it exists it is displayed. 
    static loadView(view){  
        switch(view){
            case "staff":
                    if(!this.preserveState) $("#staff-view").text("")

                    if($("#staff-view").text().trim() == "")
                        if(currentUser.role == "Admin")
                            new StaffView()
                break
            case "clients":
                    if(!this.preserveState) $("#clients-view").text("")

                    if($("#clients-view").text().trim() == "")
                        if(currentUser.role == "Admin")
                            new ClientsView()
                        else if(currentUser.role == "Carer" || currentUser.role == "Doctor")
                            new ClientsView(currentUser)
                break
            case "visits":
                    if(!this.preserveState) $("#visits-view").text("")

                    if($("#visits-view").text().trim() == "")
                        if(currentUser.role == "Carer")
                            new VisitsView(currentUser)
                break
            case "meds":
                    if(!this.preserveState) $("#meds-view").text("")

                    if($("#meds-view").text().trim() == "")
                        new MedsView(currentUser)

                        // if(currentUser.role == "Admin")
                        // else if(currentUser.role == "Carer")
                        //     new MedsView(currentUser)
                break
            case "client":
                    if(!this.preserveState) $("#client-view").text("")

                    if($("#client-view").text().trim() == "")
                        new ClientView(currentUser) 
                break        
            }

        $('.view').addClass("d-none")
        $(`#${view}-view`).removeClass("d-none")
        this.navSetActive(`#btn-nav-${view}`)
    }

    static async signOut(){
        if(await Prompt.confirm("Are you sure you want to sign out?")){
            Auth.signOut()
            location.reload()
        }
    }

    static navSetActive(id){
        $(".nav-btn").each(function() {
            $(this).removeClass("active")
        })

        $("#bottom-nav .nav-btn span").each(function() {
            $(this).addClass("d-none")
        })

        $(`${id}`).addClass("active")
        $(`#bottom-nav ${id} span`).removeClass("d-none")
    }

    static listeners(){
        $(document).on('click', '#btn-nav-staff', () => {
            try{
                Android.showAndroidToast("FROM WEBVIEW")
            }catch(error){
                // Prevent error from being thrown if not on Android device. 
            }

            this.loadView("staff")
        })

        $(document).on('click', '#btn-nav-clients', () => {
            this.loadView("clients")
        })

        $(document).on('click', '#btn-nav-visits', () => {
            this.loadView("visits")
        })

        $(document).on('click', '#btn-nav-meds', () => {
            this.loadView("meds")
        })

        $(document).on('click', '#btn-nav-client', () => {
            this.loadView("client")
        })

        $(document).on('click', '#btn-nav-settings', () => {
            this.loadView("settings")
        })

        $(document).on('click', '#btn-nav-signout', () => {
            this.signOut()
        })
    }
}


// SB Admin JS //
function sbAdmin(){
    // Enable Bootstrap tooltips via data-attributes globally
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Bootstrap popovers via data-attributes globally
    $('[data-toggle="popover"]').popover();

    $(".popover-dismiss").popover({
        trigger: "focus"
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
