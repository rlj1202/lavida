import { Service } from 'typedi';
import bcrypt from 'bcryptjs';

import User from '../models/User.model';

import { IUserRegisteration } from '../interfaces/IUser';

@Service()
export default class AuthService {
    public async SignUp(data: IUserRegisteration) {
        var hash: string = bcrypt.hashSync(data.password, 10);

        const user = User.build({
            authId: data.id,
            name: data.name,
            passwordHash: hash,
            email: data.email,
        });
        await user.save();
    }

    public async SignIn(id: string, password: string): Promise<User | null> {
        return User.findOne({
            where: {
                authId: id
            }
        }).then((user) => {
            if (user && bcrypt.compareSync(password, user.passwordHash)) { // Does user exist and does password match?
                return user;
            }

            return null;
        }).catch((err) => {
            return null;
        });
    }

    public async SignOut(id: string) {

    }
};