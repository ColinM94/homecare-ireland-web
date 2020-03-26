// Toggles filter dropdown for datatables. 
function toggleFilters(div){
    $(`${div} #filters`).toggleClass("d-none")
    $(`${div} #icon-filter`).toggleClass("fa-chevron-up fa-chevron-down")
}

class Table{
    // Checks if datatable has been initialised. 
    static exists(table){
        if($(table).text().trim() == 0) return false
        else return true
    }

    //  Clears datatable and loads new data. 
    static refresh(table, data){
        let t = $(table).DataTable()
        t.clear() 
        t.rows.add(data)
        t.draw()
    }

    // static filters(ref, div, cols, titles, archived){
    //     let numCols = cols.length+1


    //     // titles.forEach(title => {
    //     //     $(`${div} #filter-titles`).append(`<h6 class="col-xs-6 m-0 p-0 text-center">${title}</h6> `)
    //     // })
    //     let colCounter = 0

    //     ref.oInstance.api().columns(cols).every(function() {
    //         var column = this
    //         console.log(column)
            // var select = $(`
            //         <div class="col">
            //             <span>${titles[colCounter]}</span>
            //             <select class="form-control col">
            //                 <option value="" selected>- -</option>
            //             </select>
            //         </div>
            //     `)
            //     .appendTo($(`#filters`))
            //     .on('change', function () {
            //         var val = $.fn.dataTable.util.escapeRegex($(this).val())  
            //         column.search(val ? '^' + val + '$' : '', true, false).draw()
            //     })


    //         column.data().unique().sort().each(function (d, j) {
    //             select.append('<option value="' + d + '">' + d + '</option>')
    //         }) 

    //         colCounter++   
    //     })

    //     if(archived){
    //         $(`${div} #filter-titles`).append('<h6 class="col text-center">Archived</h6>')
    //         $(`${div} #filters-dropdown`).append('<input id="checkbox-archived" class="form-control col" type="checkbox">')
    //     } 
    // }

    static filters(ref, div, cols, titles, archive){
        titles.forEach(title => {
            // $(`${div} #filter-titles`).append(`<h6 class="col ml-xs-0 mr-xs-0 mr-sm-2 text-center">${title}</h6> `)
        })

        let i = 0

        ref.oInstance.api().columns(cols).every(function() {
            var column = this

            var html = `
                            <div class="col-12 col-sm-auto mt-3 text-center" id="col">
                                <h6>${titles[i]}</h6> 
                                <div id="${i}"</div>
                        `

            html += '</div>'
            
            $(`${div} #filters`).append(html)

            var select = $(`
                                <select class="form-control" id="${titles[i]}-filter">
                                    <option value="">-</option>
                                </select>
                            `)
                .appendTo($(`${div} #filters #${i}`))
                .on('change', function () {
                    var val = $.fn.dataTable.util.escapeRegex($(this).val())  
                    column.search(val ? '^' + val + '$' : '', true, false).draw()
                })

                column.data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                }) 

                i++
            })
    }

    static detachSearch(div){
        $(`${div} #datatable_filter`).detach().appendTo(`${div} #datatable-search`)
    }

    static rowClick(table, ref){
        table.rows().deselect()
        table.row(ref.currentTarget).select()

        if(table.row(ref.currentTarget).data() != undefined)
            return table.row(ref.currentTarget).data()
    }
}


