
module.exports = (config) => {
    if (!config.get('jwtSecret')) {
        throw new Error('FATAL ERROR: jwtSecret is not defined.');
    }
}
