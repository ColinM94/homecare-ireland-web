class Client {
    constructor(id, name, gender, dob, mobile, address1, address2, town, county, eircode, marital, active){
        this.id = id
        this.name = name
        this.gender = gender
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

    // Instantiates class with values from firestore document. 
    docToClient(doc) {
        this.id = doc.id
        this.name = doc.data().name
        this.gender = doc.data().gender
        this.dob = Convert.tsToDate(doc.data().dob)
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
            gender : this.gender,
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