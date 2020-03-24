class MedDetails{
    static async load(medId){
        let med = await MedsDB.getMed(medId)

        $("#med-details-id").text(med.id)
        $("#med-details-name").text(med.name)

        this.listeners()
    }

    static listeners(){
            $('#btn-meddetails-close').on('click touchstart', function(){
            $('#medDetails').hide()
        })
    }
}