class Med{
    constructor(id, name){
        this.id = id
        this.name = name
    }

    // Instantiates class with values from firestore document. 
    docToClient(doc) {
        this.id = doc.id
        this.name = doc.data().name
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let med = {
            name : this.name   
        }

        return med
    }
}