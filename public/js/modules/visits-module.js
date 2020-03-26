class VisitsModule{
    // user/client id, module id, table id, search id
    constructor(id, div){

                // $(`${div}`).load("views/visits.html")

        let visits = db.collection('visits').where('userId', '==', id).where('clientId', '==', id)

        visits.onSnapshot(querySnapshot => {
            let visits = new Array()
            querySnapshot.forEach(doc => {
                let visit = new Visit()
                visit.docToVisit(doc)
                visits.push(visit)
            })
            this.loadTable(div, visits)
            console.log(visits)
        }, err => {
            console.log(`Encountered error: ${err}`)
            Notification(2, "Problem loading visits")
        })

        this.loadHTML(div)
    }

    loadHTML(div){
        $(div).load("views/visits.html")
    }

    loadTable(div, visits){
        let table = $(this.div > '#datatable')
        $(table).DataTable({
            data: this.visits,
            lengthChange: false,
            paging: false,
            bFilter: true,
            // responsive: {
            //     details: false
            // },
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            columnDefs: [
                { targets: 0, title: "User ID", data: "userId"},
                { targets: 1, title: "Client ID", data: "clientId"},
            ],
            initComplete : function() {
                $(table+"_filter").detach().appendTo(search)
            },
        })
    }    
}