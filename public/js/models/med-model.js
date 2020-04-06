class MedModel{
    constructor(id, name, type, description, dosages, sideEffects){
        this.id = id
        this.name = name
        this.type = type
        this.description = description
        this.dosages = dosages
        this.sideEffects = sideEffects
    }

    // Instantiates class with values from firestore document. 
    docToMed(doc) {
        this.id = doc.id
        this.name = doc.data().name
        this.type = doc.data().type
        this.description = doc.data().description
        this.dosages = doc.data().dosages
        this.sideEffects = doc.data().sideEffects
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let med = {
            name : this.name,  
            type : this.type,
            description : this.description,
            dosages : this.dosages,
            sideEffects : this.sideEffects
        }

        return med
    }
}