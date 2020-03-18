class Prescription{
    constructor(id, dosage, notes){
        this.id = id
        this.dosage = 
        this. 
    }

    docToPrescription(doc){
        this.id = doc.id
        this.dosage = doc.data().dosage
        this.notes = doc.data().notes
    }
}