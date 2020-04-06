class BlankModule{
    constructor(div, title, message){
        console.log("BLANKKK")
        $(`${div}`).load("views/templates/details.html", () => {
            console.log(`${div} #title`)
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
