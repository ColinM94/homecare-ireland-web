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
            { title: "ID", data: "id", visible: false},
            { title: "Name", data: "name" },
            { title: "DOB", data: "dob"},
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
                return `<a href="javascript:confirmDeactivate('${row.id}')">Deactivate</a>`
            }},
            {mRender: function (data, type, row) {
                return `<a href="javascript:viewProfile('${row.id}')">View Profile</a>`
            }},
        ]
    })

    listeners()
}

// Returns array of clients from DB.  
async function getClients() {
    let clients = new Array()

    let result = await db.collection('clients').where('active' ,'==', true).get()

    result.forEach(doc => {
        let client = new Client()   
        client.docToClient(doc)
        clients.push(client)
    })

    return clients
}

// Returns client from DB. 
async function getClient(clientId) {
    let doc = await db.collection('clients').doc(clientId).get()

    let client = new Client()

    client.docToClient(doc)

    return client
}

// Adds a new client to DB.  
async function addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, active) {  
    let client = new Client(null, name, dob, mobile, address1, address2, town, county, eircode, marital, active)
    await db.collection("clients").add(client.toFirestore())
    refreshTable()
}

// Updates existing client details in DB.
async function updateClient(id, name, dob, mobile, address1, address2, town, county, eircode, marital, active) {
    let client = new Client(id, name, dob, mobile, address1, address2, town, county, eircode, marital, active)

    db.collection("clients").doc(id).set(client.toFirestore())

    refreshTable()
}

// Deactivates client account. 
async function deactivateClient (clientId) {
    db.collection('clients').doc(clientId).update({
        "active": false
    })

    refreshTable()
}

// Opens modal and inserts values into edit client form. 
function editClientForm(clientId) {
    $('#modalEditClient').modal('show')

    getClient(clientId).then(result => {
        $("#editClientId").val(clientId)
        $("#editClientName").val(result.name)
        $("#editClientDob").val(result.dob) 
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
function confirmDeactivate(clientId){
    $('#modalConfirmDeactivate').modal('show')
    $('#idHolder').text(clientId)
}

// Resets and reloads datatable. 
async function refreshTable(){
    let clients = await getClients()
    log("old refresh")
    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(clients)
    table.draw()
}

// Instantiates listeners. 
function listeners() {
    $("#formAddClient").submit(function(event) {
        event.preventDefault()

        let name = $("#addClientName").val()
        let dob = $("#addClientDob").val()
        let mobile = $("#addClientMobile").val()
        let address1 = $("#addClientAddress1").val()
        let address2 = $("#addClientAddress2").val()
        let town = $("#addClientTown").val()
        let county = $("#addClientCounty").val()
        let eircode = $("#addClientEircode").val()
        let marital = $("#addClientMarital").val()

        addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#addClientModal').modal('hide')
    })

    $("#formEditClient").submit(function(event) {
        event.preventDefault()

        let id = $("#editClientId").val()
        let name = $("#editClientName").val()
        let dob = $("#editClientDob").val()
        let mobile = $("#editClientMobile").val()
        let address1 = $("#editClientAddress1").val()
        let address2 = $("#editClientAddress2").val()
        let town = $("#editClientTown").val()
        let county = $("#editClientCounty").val()
        let eircode = $("#editClientEircode").val()
        let marital = $("#editClientMarital").val()

        updateClient(id, name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#modalEditClient').modal('hide')
    })

    $('#btnConfirmDeactivate').click(function(){
        var clientId = $('#idHolder').text()
        $('#modalConfirmDeactivate').modal('hide')
        deactivateClient(clientId)
    })

    $('#btnCloseProfile').click(function(){
        $('#clientsList').show()
        $('#clientProfile').hide()
    })
}

class Client {
    constructor(id, name, dob, mobile, address1, address2, town, county, eircode, marital, active){
        this.id = id
        this.name = name
        this.dob = dob
        this.mobile = mobile
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
        this.marital = marital
        this.active = active
    }

    // Gets values from firestore document. 
    docToClient(doc) {
        this.id = doc.id
        this.name = doc.data().name
        this.dob = doc.data().dob
        this.mobile = doc.data().mobile
        this.address1 = doc.data().address1
        this.address2 = doc.data().address2
        this.town = doc.data().town
        this.county = doc.data().county
        this.eircode = doc.data().eircode
        this.marital = doc.data().marital
        this.active = doc.data().active
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let client = {
            name : this.name,
            dob : this.dob,
            mobile : this.mobile,
            address1 : this.address1,
            address2 : this.address2 ,
            town : this.town,
            county : this.county,
            eircode : this.eircode,
            marital : this.marital,
            active : this.active
        }

        return client
    }
}


