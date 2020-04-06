// Notify user with a message.  
class Notification{
    static async display(type, message){
        $('.alert').addClass("d-none")

        $('#notification').hide()

        // Resets fade timer. 
        $('#notification').stop()

        switch(type){
            case 1: 
                // $(".alert-heading").text("Success")
                $("#alert-success").removeClass("d-none")
                break
            case 2: 
                // $(".alert-heading").text("Error")
                $("#alert-error").removeClass("d-none")
                break
            case 3: 
                $("#alert-neutral").removeClass("d-none")

        }

        $("#notification").fadeIn().delay(5000).fadeOut()

        $(".alert-content").html(message)
    }

    static formError(message){
        $('.form-error').text(message)
    }

    static formSuccess(message){
        $('.form-success').text(message)
    }

    static listeners(){
        $('#btn-close-msg').on('click touchstart', function(){
            $('#alert-box').css('display', 'none')
        })
    }
}