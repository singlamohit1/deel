const {Profile} = require('../models/index')

const getProfile = async (req, res, next) => {
    const profile = await Profile.findOne({where: {id: req.get('profile_id') || 0}, raw: true})
    if(!profile) return res.status(401).end()
    req.profile = profile
    next()
}
module.exports = {getProfile}
