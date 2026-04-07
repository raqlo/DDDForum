import {UserRepository} from "../repository/userRepo";
import {User} from "../dtos/createUser.dto";


export class UserService {
    private connection: UserRepository;

    constructor(db: UserRepository) {
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

