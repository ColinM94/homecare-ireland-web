// Modal prompts for user. 
class Prompt{
    static userInput = false

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
            await this.sleep(300)      

            if(this.userInput == "yes"){
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
        $('#btn-modal-confirm-yes').click(function(){
            Prompt.userInput = "yes"
        })

        $('#btn-modal-confirm-cancel').click(function(){
            Prompt.userInput = "cancel"
        })
    }
}