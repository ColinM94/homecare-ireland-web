class SettingsView{
    static load(){
        this.div = "#settings-view"

        $(this.div).text("")
        $(this.div).append(`
            <div class="mx-2 mx-sm-4 ">
                <hr>
                PUT SETTINGS HERE!!!<br>
                <hr>
                Setting #1 
                <button class="btn btn-dark" type="button">Yes</button>
                <button class="btn btn-dark" type="button">No</button><br>
                <hr>
                Setting #2 
                <button class="btn btn-dark" type="button">Yes</button>  
                <button class="btn btn-dark" type="button">No</button><br>
                <hr> 
            </div>
        `)
    }
}