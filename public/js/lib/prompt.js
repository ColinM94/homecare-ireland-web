// Modal prompts for user. 
class Prompt{
    static userInput

    static async sleep(msec) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }

    static async confirm(message){
        this.userInput = false
        let result = null
        $('#confirm-message').text("")
        $('#confirm-message').text(message)
        $('#modal-confirm').modal('show')
    
        this.listeners()

        while(result == null){ 
            await this.sleep(200)      
           
            if(this.userInput == "yes" || this.userInput == "enter"){
                result = true
            }else if(this.userInput == "cancel"){
                result = false
            }else if($('#modal-confirm').css('display') == 'none'){
                result = false
            }
        }

        $('#modal-confirm').modal('hide')
        return result
    }

    static listeners(){
        $('#btn-confirm-yes').on('click touchstart', function(){
            Prompt.userInput = "yes"
        })

        $('#btn-confirm-cancel').on('click touchstart', function(){
            Prompt.userInput = "cancel"
        })

        $(document).on('keypress',function(e) {
            if(e.which == 13) {
                Prompt.userInput = "enter"
            }
        })
    }
}