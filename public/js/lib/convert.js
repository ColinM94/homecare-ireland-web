class Convert{
    // Converts timestamp to date. 
    static tsToDate(timestamp){
        var date = new Date(1970, 0, 1) // Epoch
        date.setSeconds(timestamp.seconds)
        return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) 
    }

    static boolToText(bool){
        if(bool) return "Yes"
        else return "No"
    }
}