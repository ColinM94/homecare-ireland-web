class SettingsModel{
    constructor(id, preserveTabState){
        this.id = id
        this.preserveTabState = preserveTabState
    }

    // Instantiates class with values from firestore document. 
    docToSettings(doc) {
        this.id = doc.id
        this.preserveTabState = this.preserveTabState
    }

    // Returns object that can be used with Firestore. 
    toFirestore() {
        let settings = {
            name : this.name,  
            preserveTabState : this.preserveTabState
        }

        return med
    }
}