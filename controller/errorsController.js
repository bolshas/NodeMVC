module.exports = {
    notFound: function(data, callback) {
        var self = this
        self.view.error = self.router.session.error
        return(callback())
    }
}