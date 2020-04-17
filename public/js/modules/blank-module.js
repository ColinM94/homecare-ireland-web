class BlankModule{
    constructor(div, title, message){
        $(`${div}`).load("views/templates/details.html", () => {
            $(`${div} #title`).text(title)
            if(title == "") $(`${div} .card-header`).removeClass("d-inline-flex").addClass("d-none")

            $(`${div} .card-body`).append(`
            <div class="row">
                <div class="col">
                    <span class="font-weight-bold">${message}</span>
                </div>
            </div>`   
         )
        })
    }
}
