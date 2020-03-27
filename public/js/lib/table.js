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

    static filters(ref, div, cols, titles, archive){
        let i = 0

        ref.oInstance.api().columns(cols).every(function() {
            var column = this

            var html = `
                        <div class="col-12 col-lg-6 col-xl-auto row">
                            <div class="col-4 col-xl-auto my-auto text-center">
                                <h6 class="my-auto">${titles[i]}</h6>
                            </div>
                            <div class="col-8 col-xl-auto">
                                <div id="${i}"></div>
                            </div>
                        </div>
                        `

            html += '</div>'
            $(`${div} #filters`).append(html)

            var select = $(`
                                <select class="form-control w-5" id="${titles[i]}-filter">
                                    <option value="">No Filter</option>
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


