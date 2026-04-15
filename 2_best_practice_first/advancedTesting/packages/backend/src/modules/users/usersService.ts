import { Database } from "@dddforum/backend/src/shared/database";
import { CreateUserCommand } from "./usersCommand";
import {
  EmailAlreadyInUseException,
  UserNotFoundException,
  UsernameAlreadyTakenException,
} from "./usersExceptions";
import {User, ValidatedUser} from "@dddforum/shared/src/api/users";
import {UsersRepository} from "./ports/usersRepo";
import {TextUtil} from "@dddforum/shared/src/utils/textUtil";
import {TransactionalEmailApi} from "../notifications/ports/transactionalEmailApi";

export class UsersService {
  constructor(
    private repository: UsersRepository, // This should be done
    private emailAPI:  TransactionalEmailApi,
  ) {}

  async createUser(userData: CreateUserCommand): Promise<User> {
    const existingUserByEmail = await this.repository.findUserByEmail(
      userData.email,
    );
    if (existingUserByEmail) {
      throw new EmailAlreadyInUseException(userData.email);
    }

    const existingUserByUsername = await this.repository.findUserByUsername(
      userData.username,
    );
    if (existingUserByUsername) {
      throw new UsernameAlreadyTakenException(userData.username);
    }

    const validatedUser: ValidatedUser = {
      ...userData.props,
      password: TextUtil.createRandomText(10)
    }

    const prismaUser = await this.repository.save(validatedUser);

    await this.emailAPI.sendMail({
      to: validatedUser.email,
      subject: "Your login details to DDDForum",
      text: `Welcome to DDDForum. You can login with the following details </br>
      email: ${validatedUser.email}
      password: ${validatedUser.password}`,
    });

    return prismaUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }
    return user;
  }
}
