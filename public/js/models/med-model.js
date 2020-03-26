class MedModel{
    constructor(id, name, description, sideEffects){
        this.id = id
        this.name = name
        this.description = description
        this.sideEffects = sideEffects
    }

    // Instantiates class with values from firestore document. 
    docToMed(doc) {
        this.id = doc.id
        this.name = doc.data().name
        this.description = doc.data().description
        this.sideEffects = doc.data().sideEffects
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let med = {
            name : this.name,  
            description : this.description,
            sideEffects : this.sideEffects
        }

        return med
    }
}