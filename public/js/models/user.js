class User {
    constructor(id, role, name, gender, address1, address2, town, county, mobile, eircode, active) {
        this.id = id
        this.role = role
        this.name = name
        this.gender = gender
        this.address1 = address1
        this.address2 = address2
        this.town = town
        this.county = county
        this.eircode = eircode
        this.mobile = mobile
        this.active = active
    }

    // Instantiates class with values from firestore document. 
    docToUser(doc) {
        this.id = doc.id
        this.role = doc.data().role
        this.name = doc.data().name
        this.gender = doc.data().gender
        this.address1 = doc.data().address1
        this.address2 = doc.data().address2
        this.town = doc.data().town
        this.county = doc.data().county
        this.eircode = doc.data().eircode
        this.mobile = doc.data().mobile
        this.active = doc.data().active
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let user = {
            id : this.id,
            role : this.role,
            name : this.name,
            gender : this.gender,
            address1 : this.address1,
            address2 : this.address2,
            town : this.town,
            county : this.county,
            eircode : this.eircode,
            mobile : this.mobile,
            active: this.active
        }

        return user
    }
}