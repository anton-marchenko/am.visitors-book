
module.exports = (appProcess) => {
    appProcess.on('unhandledRejection', (ex) => {
        throw ex;
    });
}
