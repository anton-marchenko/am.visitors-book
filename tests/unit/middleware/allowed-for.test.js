const allowedFor = require('../../../middleware/allowed-for');

describe('allowedFor middleware', () => {

    let next,
        send,
        status,
        userRoles;

    const exec = () => {
        const roles = [
            'role1',
            'role2'
        ];
        next = jest.fn();
        const req = {
            user: {
                roles: userRoles
            }
        }
        send = jest.fn();
        status = jest.fn().mockReturnValue({ send });
        const res = { status };

        allowedFor(roles)(req, res, next);
    }

    it('should return 403 if user does not have any of the given roles', () => {
        userRoles = [];

        exec();

        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status.mock.calls[0][0]).toBe(403);
    });

    it('should call next if user has some of the given roles', () => {
        userRoles = ['role1'];

        exec();

        expect(next).toHaveBeenCalled();
    });
});