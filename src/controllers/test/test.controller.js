exports.test = async (req, res) => {
    return res.status(200).send({ success: true, message: 'Server is running',user: req.user || null });
};