class Prescription{
    constructor(id, dosage, notes){
        this.id = id
        this.dosage = dosage
        this.notes = notes
    }

    docToPrescription(doc){
        this.id = doc.id
        this.dosage = doc.data().dosage
        this.notes = doc.data().notes
    }
}