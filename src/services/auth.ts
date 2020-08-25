import { Service } from 'typedi'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';

import User from '../models/User.model'

@Service()
export default class AuthService {
    public async SignUp(id: string, password: string) {
        var uuid = uuidv4();
        var hash = bcrypt.hashSync(password, 10);

        const user = User.build({
            uuid: uuid,
            id: id,
            passwordHash: hash,
        });
        await user.save();
    }

    public async SignIn(id: string, password: string) {
        var hash = bcrypt.hashSync(password, 10);
    }

    public async SignOut(id: string) {

    }
};