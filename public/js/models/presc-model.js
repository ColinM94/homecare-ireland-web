class PrescModel{
    constructor(id, medId, clientId, dosage, notes){
        this.id = id
        this.medId = medId
        this.clientId = clientId
        this.dosage = dosage
        this.notes = notes
    }

    docToPresc(doc){
        this.id = doc.id
        this.medId = doc.data().medId
        this.clientId = doc.data().clientId
        this.dosage = doc.data().dosage
        this.notes = doc.data().notes
    }

    toFirestore(){
        let presc = {
            medId : this.medId,
            clientId : this.clientId,
            dosage : this.dosage,
            notes : this.notes
        }

        return presc
    }
}