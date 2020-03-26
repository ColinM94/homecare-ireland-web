class Module{
    static appendDetail(div, name, value){

        $(`${div} .card-body`).append(`
            <div class="row">
                <div class="col">
                    <span class="font-weight-bold">${name}</span>
                </div>
                <div class="col">
                    <span>${value}</span>
                </div>
            </div>
            <hr>`   
         )
    }

    static clearDetails(div){
        $(`${this.div} .card-body`).text("")
    }
}