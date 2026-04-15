import {InMemoryUserRepository} from "@dddforum/backend/src/modules/users/adapters/inMemoryUserRepositorySpy";
import { defineFeature, loadFeature } from 'jest-cucumber';
import path from "path";
import {sharedTestRoot} from "@dddforum/shared/src/paths";
import {CompositionRoot} from "@dddforum/backend/src/shared/compositionRoot";
import {Config} from "@dddforum/backend/src/shared/config";
import {CreateUserCommandBuilder} from "@dddforum/shared/tests/support/builders/createUserCommandBuilder";
import {Application} from "@dddforum/backend/src/shared/application/applicationInterface";
import {CreateUserCommand} from "@dddforum/backend/src/modules/users/usersCommand";
import {User, CreateUserParams} from "@dddforum/shared/src/api/users";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
);

defineFeature(feature, (test) => {
  let composition: CompositionRoot;
  let fakeUserRepo: InMemoryUserRepository;
  let application: Application;
  let createUserParams: CreateUserParams;
  let createUserResponse: User;
  let addEmailToListResponse: boolean;

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
      createUserParams = new CreateUserCommandBuilder()
        .withAllRandomDetails()
        .withFirstName('Khalil')
        .withLastName('Stemmler')
        .build();
    });

    when('I register with valid account details accepting marketing emails', async () => {
      const createUserCommand = new CreateUserCommand(createUserParams);
      createUserResponse = await application.users.createUser(createUserCommand);
      addEmailToListResponse = await application.marketing.addEmailToList(createUserParams.email);
    });

    then('I should be granted access to my account', async () => {
      expect(createUserResponse.id).toBeDefined();
      expect(createUserResponse.email).toEqual(createUserParams.email);
      expect(createUserResponse.firstName).toEqual(createUserParams.firstName);
      expect(createUserResponse.lastName).toEqual(createUserParams.lastName);
      expect(createUserResponse.username).toEqual(createUserParams.username);

      // And the user exists (State Verification)
      const getUserResponse = await application.users.getUserByEmail(createUserParams.email);
      expect(createUserParams.email).toEqual(getUserResponse.email);
    })

    and('I should expect to receive marketing emails', () => {
      // Todo
    });
  })

  test('Successful registration without marketing emails accepted', ({ given, when, then, and }) => {
    given('I am a new user', () => {

    });

    when('I register with valid account details declining marketing emails', () => {

    });

    then('I should be granted access to my account', () => {

    });

    and('I should not expect to receive marketing emails', () => {

    });
  });


    test('Invalid or missing registration details', ({ given, when, then, and }) => {
      given('I am a new user', () => {

      });

      when('I register with invalid account details', () => {

      });

      then('I should see an error notifying me that my input is invalid', () => {

      });

      and('I should not have been sent access to account details', () => {

      });
    });

    test('Account already created with email', ({ given, when, then, and }) => {
      given('a set of users already created accounts', (table) => {

      });

      when('new users attempt to register with those emails', () => {

      });

      then('they should see an error notifying them that the account already exists', () => {

      });

      and('they should not have been sent access to account details', () => {

      });
    });

    test('Username already taken', ({ given, when, then, and }) => {
      given('a set of users have already created their accounts with valid details', (table) => {

      });

      when('new users attempt to register with already taken usernames', (table) => {

      });

      then('they see an error notifying them that the username has already been taken', () => {

      });

      and('they should not have been sent access to account details', () => {

      });
    });
  })
