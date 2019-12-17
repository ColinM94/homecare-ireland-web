// Populates clients datatable and sets up listeners. 
function setupClients () {
    var clients = new Array()
 
    var clientDetails = db.collection('clientDetails').get().then( snapshot => {
        snapshot.forEach(doc => {
            var client = new Array()

            client[0] = doc.id
            client[1] = doc.data().name
            client[2] = doc.data().mobile
            client[3] = doc.data().address1
            client[4] = doc.data().address2
            client[5] = doc.data().town
            client[6] = doc.data().county
            client[7] = doc.data().eircode
            client[8] = doc.data().marital

            clients.push(client)
        })

        $('#datatable').DataTable( {
            data: clients,
            "lengthChange": false,
            oLanguage: {
                sLengthMenu: "_MENU_",
                sSearch: '', searchPlaceholder: "Search..." 
            },
            initComplete : function() {
                $("#datatable_filter").detach().appendTo('#datatableSearch');
            },
            columns: [
                { title: "ID" },
                { title: "Name" },
                { title: "Mobile"},
                { title: "Address 1"},
                { title: "Address 2"},
                { title: "Town"},
                { title: "County"},
                { title: "Eircode"},
                { title: "Marital Status"},
                {mRender: function (data, type, row) {
                    return `<a href="javascript:deleteClient('${row[0]}')">Delete</a>`
                }},
            ]
        })
    })

    // Listeners.
    $("#form-client").submit(function( event ) {
        addClient()
        event.preventDefault();
    })
}

// Adds a new client to Firestore. 
function addClient () {

    var name = $("#client-name").val()
    var mobile = $("#client-mobile").val()
    var address1 = $("#client-address1").val()
    var address2 = $("#client-address2").val()
    var town = $("#client-town").val()
    var county = $("#client-county").val()
    var eircode = $("#client-eircode").val()
    var marital = $("#client-marital").val()

    log("Adding Client")

    let client = {
        name: name,
        mobile: mobile
    }

    let clientDetails = {
        name : name,
        mobile : mobile,
        address1 : address1,
        address2 : address2 ,
        town : town,
        county : county,
        eircode : eircode,
        marital : marital
    }

    db.collection("clients").add(client).then(ref => {
        log("Adding client with id", ref.id)
        db.collection("clientDetails").doc(ref.id).set(clientDetails) 
    }).catch(error => {
        log(error.message)
    })
}

// Removes client from Firestore. 
function deleteClient (clientId) {
    db.collection('clients').doc(clientId).delete()
    db.collection('clientDetails').doc(clientId).delete()
    db.collection('connections').doc(clientId).delete()

    var table = $('#clientsTable').DataTable()

    table
    .rows( function ( idx, data, node ) {
        return data[0] === clientId;
    } )
    .remove()
    .draw();
}

