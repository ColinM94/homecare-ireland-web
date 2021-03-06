class Convert{
    // Converts timestamp to date. 
    // static tsToDate(timestamp){
    //     var date = new Date(1970, 0, 1) // Epoch
    //     date.setSeconds(timestamp.seconds)
    //     // return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
    //     return ('0' + date.getDate()).slice(-2)  + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + date.getFullYear() 
    // }

    static tsToDate(timestamp){
        var date = new Date(1970, 0, 1) // Epoch
        date.setSeconds(timestamp.seconds)
        return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        // return ('0' + date.getDate()).slice(-2)  + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + date.getFullYear() 
    }

    static tsToDateTime(timestamp){
        var date = new Date(1970, 0, 1) // Epoch
        date.setSeconds(timestamp.seconds)
        return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + " @ " 
        + date.getHours() + ":" + date.getMinutes()

        // return newDate.split('-').reverse().join('-')
    }

    static tsToTime(timestamp){
        var date = new Date(1970, 0, 1) // Epoch
        date.setSeconds(timestamp.seconds)
        return date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()
    }

    static dateToTs(date){
        var datum = Date.parse(date);
        return datum;
    }

    static boolToText(bool){
        if(bool) return "Yes"
        else return "No"
    }
}