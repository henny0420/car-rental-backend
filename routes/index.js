const { BOOKING } = require('../models');

module.exports = {
    USER : require('./user.route'),
    ROLE : require('./role.route'),
    BRAND : require('./brand.route'),
    CAR : require('./car.route'),
    COUPAN :  require('./coupan.route'),
    BOOKING : require('./booking.route')

}