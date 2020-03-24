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

    static filters(ref, div, cols, titles, archived){
        titles.forEach(title => {
            $(`${div} #filter-titles`).append(`<h6 class="col mr-2 text-center">${title}</h6> `)
        })

        ref.oInstance.api().columns(cols).every(function() {
            var column = this

            var select = $('<select class="form-control mr-2 col"><option value="">-</option></select>')
                .appendTo($(`${div} #filters-dropdown`))
                .on('change', function () {
                    var val = $.fn.dataTable.util.escapeRegex($(this).val())  
                    column.search(val ? '^' + val + '$' : '', true, false).draw()
                })


            column.data().unique().sort().each(function (d, j) {
                select.append('<option value="' + d + '">' + d + '</option>')
            })    
        })

        if(archived){
            $(`${div} #filter-titles`).append('<h6 class="col text-center">Archived</h6>')
            $(`${div} #filters-dropdown`).append('<input id="checkbox-archived" class="form-control mr-2 col" type="checkbox">')
        } 
    }

    static detachSearch(div){
        $(`${div} #datatable_filter`).detach().appendTo(`${div} #datatable-search`)
    }

    static rowClick(table, ref){
        table.rows().deselect()
        table.row(ref.currentTarget).select()
        if(table.row(ref.currentTarget).data() != undefined)
            return table.row(ref.currentTarget).data().id
    }
}


