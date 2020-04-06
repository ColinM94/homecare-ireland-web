class Module{
    // Loads {file} into {div} then calls module load function.
    static loadHTML(ref, div, file){  
        $(div).load(file, () => {
            ref.load()
        })
    }

    // Scrolls element into view. 
    static scroll(div){
        let element = $(div)[0]
    
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest", top: 50});
    }

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

    static appendButtons(div, buttons){
        console.log(div)
        $(`${div} .card-body`).append(`<div class="row">`)

        buttons.forEach(button => {
            $(`${div} .card-body`).append(`
                <button class="btn btn-primary" id="${button[0]}">${button[1]}</button>
            `)
        })

        $(`${div} .card-body`).append(`</div>`)
    }

    static async createForm(parentDiv, formId, title, btnText){
    
        if(parentDiv[0] == "#") parentDiv = parentDiv.slice(1)
        if(formId[0] == "#") formId = formId.slice(1)

        let modal = `${formId}-modal`

        if ($(`#${parentDiv} #${modal}`).length){
            return
        }

        $(`#${parentDiv}`).append(`
            <div class="modal fade" id="${modal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="title">${title}</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="fas fa-times"></i></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="${formId}" class="mx-1">
                            
                            </form>
                        </div>
                        <div class="modal-footer w-100">
                            <span class="form-error text-danger mr-auto w-25"></span>
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
                            <button id="btn-${formId}" class="btn btn-primary" type="button">${btnText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }   

    // <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>

    static addField(formId, type, inputId, labelText, options){
        if(formId[0] == "#") formId = formId.slice(1)
        if(inputId[0] == "#") inputId = inputId.slice(1)

        if(type == "text" || type == "date"){
            $(`#${formId}`).append(`
                <div class="form-group row">
                    <label class="col-4 my-auto" for="${inputId}">${labelText}</label>
                    <input type="${type}" class="form-control col-8" id="${inputId}" title="${labelText}">
                </div>
            `)
        }else if(type == "select"){
            $(`#${formId}`).append(`
                <div class="form-group row">
                    <label class="col-4 my-auto" for="${inputId}">${labelText}</label>
                    <select class="form-control col-8" id="${inputId}">
                `)

                for(let key in options){
                    $(`#${inputId}`).append(new Option(options[key], key))
                }
                $(`#${formId}`).append(`</select></div>`)
        }else if(type == "textarea"){
            $(`#${formId}`).append(`
                <div class="form-group row">
                    <label class="col-12 my-auto" for="${inputId}">${labelText}</label>
                    <textarea class="form-control col-12" id="${inputId}" rows="4"></textarea>
                `)
        }
    }

    static addBreak(id){
        $(`#${div}`).append("<br>")
    }

    static addHR(div){
        console.log(`${div}`)
        $(`${div}`).append("<hr>")
    }

    static setTitle(div, title){
        $(`${div} #title`).text(title)
    }

    static clearDetails(div){
        $(`${div} .card-body`).text("")
    }

    static show(div){
        $(div).show()
    }

    static hide(div){
        $(div).hide()
    }

}
