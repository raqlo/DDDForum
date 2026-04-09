import {UserPersistence, UserRepository} from "./userRepo";
import {User} from "./createUser.dto";
import {TransactionalEmailApi} from "../notifications/transactionalEmailApi";


export class UserService {
    private connection: UserPersistence;

    constructor(db: UserPersistence, private emailAPI: TransactionalEmailApi,
    ) {
        this.connection = db
    }

    getUserByEmail = async (email: string) => await this.connection.findByEmail(email);

    getUserByUsername = async (username: string) => await this.connection.findByUsername(username);

    createUser = async (userData: User) => {
        const user = await this.connection.createUser({...userData})
        const member = await this.connection.createMember(user.id)
        return {member, user}
    };
}

