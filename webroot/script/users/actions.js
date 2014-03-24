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
    
    $("a").click(function(event) {
        if ($(this).data('action') !== undefined) {
            event.preventDefault()
            $('body').append($('<form action="' + $(this).data('action') + '" id="submitRowForm" method="post" style="display:none"></form>'))
            $(this).closest('tr').find('input, select, textarea').clone().appendTo($('form#submitRowForm'))
            $('form#submitRowForm').submit()
        }
    })
})