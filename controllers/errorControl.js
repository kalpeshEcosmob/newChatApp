exports.get404 = (req, res, next) => {
    res.render('error', { error: "Enter valid url please" });
}