import {InMemoryUserRepository} from "@dddforum/backend/src/modules/users/adapters/inMemoryUserRepositorySpy";
import { defineFeature, loadFeature } from 'jest-cucumber';
import path from "path";
import {sharedTestRoot} from "@dddforum/shared/src/paths";
import {CompositionRoot} from "@dddforum/backend/src/shared/compositionRoot";
import {Config} from "@dddforum/backend/src/shared/config";
import {CreateUserCommandBuilder} from "@dddforum/shared/tests/support/builders/createUserCommandBuilder";
import {Application} from "@dddforum/backend/src/shared/application/applicationInterface";
import {CreateUserCommand} from "@dddforum/backend/src/modules/users/usersCommand";
import {User} from "@dddforum/shared/src/api/users";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
);

defineFeature(feature, (test) => {
  let composition: CompositionRoot;
  let fakeUserRepo: InMemoryUserRepository;
  let application: Application;
  let createUserInput: CreateUserCommand;
  let createUserResponse: User
  let addEmailToListResponse: boolean

  beforeAll(async () => {
    composition = CompositionRoot.createCompositionRoot(new Config('test:unit'));
    fakeUserRepo = composition.getRepositories().users as InMemoryUserRepository;
    application = composition.getApplication();
  })

  afterEach(async () => {
    await fakeUserRepo.reset();
  });

  test('Successful registration with marketing emails accepted', ({given, when, then, and}) => {
    given('I am a new user', async () => {
      createUserInput = new CreateUserCommandBuilder()
        .withAllRandomDetails()
        .withFirstName('Khalil')
        .withLastName('Stemmler')
        .build();
    });

    when('I register with valid account details accepting marketing emails', async () => {
      createUserResponse = await application.users.createUser(createUserInput);
      addEmailToListResponse = await application.marketing.addEmailToList(createUserInput.email);
    });

    then('I should be granted access to my account', async () => {
      expect(createUserResponse.id).toBeDefined();
      expect(createUserResponse.email).toEqual(createUserInput.email);
      expect(createUserResponse.firstName).toEqual(createUserInput.firstName);
      expect(createUserResponse.lastName).toEqual(createUserInput.lastName);
      expect(createUserResponse.username).toEqual(createUserInput.username);

      // And the user exists (State Verification)
      const getUserResponse = await application.users.getUserByEmail(createUserInput.email);
      expect(createUserInput.email).toEqual(getUserResponse.email);
    })

    and('I should expect to receive marketing emails', () => {
      // Todo
    });
  })
})
