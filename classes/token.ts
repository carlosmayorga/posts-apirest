import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string = '-maria-mariaaa-tirititi-tirititi';
    private static expires: string = '30d';

    constructor() {}

    static getJwtToken(payload: any): string {
        return jwt.sign({usuario: payload}, this.seed, {
            expiresIn: this.expires
        });
    };

    static verifyToken(userToken: string) {

        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (err, decoded) => {

                if (err) {
                    reject();
                } else {
                    resolve(decoded);
                }

            });
        });
    };


}