
module.exports = {
    USER: require('./user.route'),
    ROLE: require('./role.route'),
    BRAND: require('./brand.route'),
    CAR: require('./car.route'),
    COUPAN: require('./coupan.route'),
    BOOKING: require('./booking.route'),
    USERADMIN: require('./admin/user.route'),
    ADMIN: require('./admin/index'),
    OWNER: require('./owner.routes')
}