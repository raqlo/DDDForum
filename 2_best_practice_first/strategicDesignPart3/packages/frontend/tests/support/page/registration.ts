import {PuppeteerPageDriver} from "../driver/puppeteerPageDriver";
import {PageObject} from "./pageObject";
import {PageElements, PageElementsConfig} from "./pageElements";
import {UserInput} from "@dddforum/shared/tests/fixtures/userBuilder";
import {appSelectors} from "../../../src/shared/selectors";

export class RegistrationPage extends PageObject {
    private elements: PageElements;

    constructor(driver: PuppeteerPageDriver) {
        super(driver, "http://localhost:5173/join");
        this.elements = new PageElements(appSelectors.registration.registrationForm as PageElementsConfig, driver);
    }

    async enterAccountDetails(input: Partial<UserInput>) {
        await this.elements.get("email").then((e: any) => e.type(input.email));
        await this.elements.get("username").then((e: any) => e.type(input.username));
        await this.elements.get("firstname").then((e: any) => e.type(input.firstName));
        await this.elements.get("lastname").then((e: any) => e.type(input.lastName));
    }

    async acceptMarketingEmails() {
        await this.elements.get("marketingCheckbox").then((e: any) => e.click());

    }

    async submitRegistrationForm() {
        await this.elements.get("submit").then((e: any) => e.click());
    }
}