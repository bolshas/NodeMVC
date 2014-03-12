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
})