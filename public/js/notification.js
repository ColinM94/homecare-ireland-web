// Notify user with a message.  
class Notification{
    static display(type, message){  
        $('#alert-box').hide()
        $('#alert-box').stop()

        switch(type){
            case 1:
                $('#alert-box-text').html("Success: " + message + "!")
                $('#alert-box').css('background-color', '#6BBD6E')
                break
            case 2:
                $('#alert-box-text').html("Error: " + message + "!")
                $('#alert-box').css('background-color', '#F66459')
                break
            case 3:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#47A8F5')
                break
            case 4:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#FFAA2C')
            break
        }
        $("#alert-box").fadeIn().delay(5000).fadeOut()

        this.listeners()
    }

    // Notification box fades out after timer. 
    static fadeOut(){
        $("#alert-box").delay(5000).fadeOut()
    }

    static listeners(){
        $('#btn-close-msg').click(function(){
            $('#alert-box').css('display', 'none')
        })
    }
}