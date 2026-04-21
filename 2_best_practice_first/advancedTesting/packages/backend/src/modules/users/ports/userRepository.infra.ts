import { PrismaClient } from "@prisma/client";

import {ProductionUserRepository} from "@dddforum/backend/src/modules/users/adapters/productionUserRepository";
import {UsersRepository} from "@dddforum/backend/src/modules/users/ports/usersRepo";
import {ValidatedUserBuilder} from "@dddforum/shared/tests/support/builders/validatedUserBuilder";

describe("userRepo", () => {
  let userRepos: UsersRepository[] = [
    new ProductionUserRepository(new PrismaClient()),
  ];

  it("can save and retrieve users by email", () => {
    let createUserInput = new ValidatedUserBuilder()
      .withAllRandomDetails()
      .build()

    userRepos.forEach(async (userRepo) => {
      let savedUserResult = await userRepo.save({
        ...createUserInput,
        password: '',
      });
      let fetchedUserResult = await userRepo.findUserByEmail(
        createUserInput.email,
      );

      expect(savedUserResult).toBeDefined();
      expect(fetchedUserResult).toBeDefined();
      expect(savedUserResult.email).toEqual(fetchedUserResult?.email);
    });
  });

  it("can find a user by username", () => {
    let createUserInput = new ValidatedUserBuilder()
      .withAllRandomDetails()
      .build();

    userRepos.forEach(async (userRepo) => {
      let savedUserResult = await userRepo.save({
        ...createUserInput,
        password: "",
      });
      let fetchedUserResult = await userRepo.findUserByUsername(
        createUserInput.username,
      );

      expect(savedUserResult).toBeDefined();
      expect(fetchedUserResult).toBeDefined();
      expect(savedUserResult.username).toEqual(fetchedUserResult?.username);
    });
  });
});
