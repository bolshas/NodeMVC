$(document).ready(function() {
    $("#delete").click(function(event) {
        $.ajax({
            url: '/users/delete/5',
            type: 'DELETE',
            success: function(result) {
                console.log(JSON.stringify(result))
                $("#someId").fadeOut(500)
            }
        })
    })
    $("a.modifyColumn").click(function(event) {
        $(this).closest('tr').find('input, select, textarea').clone().appendTo($('form#modifyColumn'))
        $('form#modifyColumn').submit()
    })    
    $("a.addColumn").click(function(event) {
        $('form#addColumn').html($(this).closest('tr').find('input, select, textarea').clone())
        $('form#addColumn').submit()
    })
})