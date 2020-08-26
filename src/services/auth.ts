import { Service } from 'typedi';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/User.model';

import { IUserRegisteration } from '../interfaces/IUser';

@Service()
export default class AuthService {
    public async SignUp(data: IUserRegisteration) {
        var uuid = uuidv4();
        var hash = bcrypt.hashSync(data.password, 10);

        const user = User.build({
            uuid: uuid,
            id: data.id,
            name: data.name,
            passwordHash: hash,
            email: data.email,
        });
        await user.save();
    }

    public async SignIn(id: string, password: string): Promise<boolean> {
        return User.findOne({
            where: {
                id: id
            }
        }).then((user) => {
            if (user) { // Does user exist?
                // Does password match?
                return bcrypt.compareSync(password, user.passwordHash);
            }

            return false;
        }).catch((err) => {
            return false;
        });
    }

    public async SignOut(id: string) {

    }
};