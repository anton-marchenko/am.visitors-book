module.exports = (allowableRoles) =>
    (req, res, next) => {
        const hasPermissionRoles = req.user.roles
            .some(role => allowableRoles.includes(role));
        if (!hasPermissionRoles) {
            return res.status(403).send('Permission denied.');
        }

        next();
    }
