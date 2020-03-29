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

    static setTitle(div, title){
        console.log(`${div} #title`)
    
        $(`${div} #title`).text(title)
    }

    static clearDetails(div){
        $(`${this.div} .card-body`).text("")
    }

}
