module.exports = {
    notFound: function() {
        var self = this
        self.view.error = self.router.session.error
    }
}