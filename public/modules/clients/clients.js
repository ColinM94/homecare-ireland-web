// Populates clients datatable and sets up listeners. 
async function setupClients () {
    let clients = await getClients()

    $('#datatable').DataTable( {
        data: clients,
        "lengthChange": false,
        paging: false,
        oLanguage: {
            sLengthMenu: "_MENU_",
            sSearch: '', searchPlaceholder: "Search..." 
        },
        initComplete : function() {
            $("#datatable_filter").detach().appendTo('#datatableSearch');
        },
        columns: [
            { title: "ID", data: "id" },
            { title: "Name", data: "name" },
            { title: "Mobile", data: "mobile"},
            { title: "Address 1", data: "address1"},
            { title: "Address 2",data: "address2"},
            { title: "Town",data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
            { title: "Marital Status", data: "marital"},
            {mRender: function (data, type, row) {
                return `<a href="javascript:editClientForm('${row.id}')">Edit</a>`
            }},
            {mRender: function (data, type, row) {
                return `<a href="javascript:confirmDelete('${row.id}')">Delete</a>`
            }},
            {mRender: function (data, type, row) {
                return `<a href="javascript:viewProfile('${row.id}')">View Profile</a>`
            }},
        ]
    })

    startListeners()
}

// Returns array of clients from DB.  
async function getClients() {
    let clients = new Array()

    let result = await db.collection('clientDetails').get()
    result.forEach(doc => {
        let client = new Client()   
        client.docToClient(doc)
        clients.push(client)
    })

    return clients
}

// Returns client from DB. 
async function getClient(clientId) {
    let doc = await db.collection('clientDetails').doc(clientId).get()

    let client = new Client()

    client.docToClient(doc)

    return client
}

// Adds a new client to DB.  
async function addClient(name, mobile, address1, address2, town, county, eircode, marital) {
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
        db.collection("clientDetails").doc(ref.id).set(clientDetails) 
        refreshTable()
    }).catch(error => {
        log(error.message)
    })
}

// Updates existing client details in DB.
async function updateClient(id, name, mobile, address1, address2, town, county, eircode, marital) {
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

    await Promise.all([
        db.collection("clients").doc(id).set(client),
        db.collection("clientDetails").doc(id).set(clientDetails) 
    ])

    refreshTable()
}

// Removes client from DB.
async function deleteClient (clientId) {
    await Promise.all([
        db.collection('clients').doc(clientId).delete(),
        db.collection('clientDetails').doc(clientId).delete(),
        db.collection('connections').doc(clientId).delete()     
    ])

    refreshTable()
}

// Opens modal and inserts values into edit client form. 
function editClientForm(clientId) {
    $('#modalEditClient').modal('show')

    getClient(clientId).then(result => {
        $("#editClientId").val(clientId)
        $("#editClientName").val(result.name) 
        $("#editClientMobile").val(result.mobile) 
        $("#editClientAddress1").val(result.address1) 
        $("#editClientAddress2").val(result.address2) 
        $("#editClientTown").val(result.town) 
        $("#editClientCounty").val(result.county) 
        $("#editClientEircode").val(result.eircode) 
        $("#editClientMarital").val(result.marital) 
    })
}

// Displays selected clients details. 
function viewProfile(clientId){
    $('#clientsList').hide()
    $('#clientProfile').show() 

    getClient(clientId).then(client => {    
        $('#clientProfileTitle').html(` ${client.name}'s Profile`)
        $('#clientProfileName').text(` ${client.name}`)
        $('#clientProfileMobile').text(` ${client.mobile}`)
        $('#clientProfileAddress').text(` ${client.address1}, ${client.address2}, ${client.town}, ${client.county}, ${client.eircode}`)
    })
}

// Prompts user to confirm client deletion. 
function confirmDelete(clientId){
    log(clientId)
    $('#modalConfirmDelete').modal('show')
    $('#idHolder').text(clientId)
}

// Resets and reloads datatable. 
async function refreshTable(){
    let clients = await getClients()

    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(clients)
    table.draw()
}

// Instantiates listeners. 
function listeners() {
    $("#formAddClient").submit(function(event) {
        event.preventDefault();

        let name = $("#client-name").val()
        let mobile = $("#client-mobile").val()
        let address1 = $("#client-address1").val()
        let address2 = $("#client-address2").val()
        let town = $("#client-town").val()
        let county = $("#client-county").val()
        let eircode = $("#client-eircode").val()
        let marital = $("#client-marital").val()

        addClient(name, mobile, address1, address2, town, county, eircode, marital)

        $('#addClientModal').modal('hide')
    })

    $("#formUpdateClient").submit(function( event ) {
        event.preventDefault()

        let id = $("#editClientId").val()
        let name = $("#editClientName").val()
        let mobile = $("#editClientMobile").val()
        let address1 = $("#editClientAddress1").val()
        let address2 = $("#editClientAddress2").val()
        let town = $("#editClientTown").val()
        let county = $("#editClientCounty").val()
        let eircode = $("#editClientEircode").val()
        let marital = $("#editClientMarital").val()

        updateClient(id, name, mobile, address1, address2, town, county, eircode, marital)

        $('#modalEditClient').modal('hide')
    })

    $('#btnConfirmDelete').click(function(){
        var clientId = $('#idHolder').text()
        $('#modalConfirmDelete').modal('hide')
        deleteClient(clientId)
    })

    $('#btnCloseProfile').click(function(){
        $('#clientsList').show()
        $('#clientProfile').hide()
    })
}

class Client {
    constructor(id, name, mobile, address1, address2, town, county, eircode, marital){
        this.id = id
        this.name = name
        this.mobile = mobile
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
        this.marital = marital
    }

    // Gets values from firestore document. 
    docToClient(doc){
        this.id = doc.id
        this.name = doc.data().name
        this.mobile = doc.data().mobile
        this.address1 = doc.data().address1
        this.address2 = doc.data().address2
        this.town = doc.data().town
        this.county = doc.data().county
        this.eircode = doc.data().eircode
        this.marital = doc.data().marital
    }
}


