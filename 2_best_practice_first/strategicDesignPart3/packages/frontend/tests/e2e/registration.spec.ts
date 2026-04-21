import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {DatabaseFixture} from "@dddforum/shared/tests/fixtures/databaseFixture";
import {PuppeteerPageDriver} from "../support/driver/puppeteerPageDriver";
import {App, createAppObject} from "../support/page/app";
import {CreateUserInputBuilder, UserInput} from "@dddforum/shared/tests/fixtures/userBuilder";
import {Pages} from "../support/page/pages";


const feature = loadFeature(path.join(__dirname, '../../../shared/tests/features/registration.feature'), {tagFilter: '@frontend'});

defineFeature(feature, (test) => {
    let app: App
    let pages: Pages;
    let puppeteerPageDriver: PuppeteerPageDriver;
    let userInput: Partial<UserInput>;
    let databaseFixture: DatabaseFixture

    beforeAll(async () => {
        databaseFixture = new DatabaseFixture();
        puppeteerPageDriver = await PuppeteerPageDriver.create({
            headless: false,
            slowMo: 50,
        });
        app = createAppObject(puppeteerPageDriver);
        pages = app.pages;
    });

    afterAll(async () => {
        await puppeteerPageDriver.browser.close();
    });

    afterEach(async () => {
        await databaseFixture.resetDatabase();
    });

    // Need to put timeout here.
    jest.setTimeout(60000);

    test('Successful registration with marketing emails accepted', ({given, when, then, and}) => {

        given('I am a new user', async () => {
            userInput = new CreateUserInputBuilder()
                .withAllRandomDetails()
                .build();

            await pages.registration.open();
            await pages.registration.acceptMarketingEmails();
        });

        when('I register with valid account details accepting marketing emails', async () => {
            await pages.registration.enterAccountDetails(userInput);
            await pages.registration.submitRegistrationForm();
        });

        then('I should be granted access to my account', async () => {
            expect(await app.layout.header.getUsernameFromHeader()).toContain(userInput.username);
        });

        and('I should expect to receive marketing emails', () => {
            // @See backend
        });
    });
})