// Displays messages to the user. 
class Message{
    static display(type, message){   
        switch(type){
            case 1:
                $('#alert-box-text').html(message)
                $('#alert-box').css('background-color', '#6BBD6E')
                break
            case 2:
                $('#alert-box-text').html(message)
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

        $('#alert-box').css('display', 'block')

        $('#btn-close-msg').click(function(){
            $('#alert-box').css('display', 'none')
        })

        this.fadeOut()
    }

    // Fades out message box after timer. 
    static fadeOut(){
        $("#alert-box").delay(5000).fadeOut()
    }
}