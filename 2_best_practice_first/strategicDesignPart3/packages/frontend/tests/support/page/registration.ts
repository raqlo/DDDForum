import { PuppeteerPageDriver } from "../driver/puppeteerPageDriver";
import { PageObject } from "./pageObject";
import {PageElements} from "./pageElements";
import {UserInput} from "@dddforum/shared/tests/fixtures/userBuilder";

export class RegistrationPage extends PageObject {
    private elements: PageElements;

    constructor(driver: PuppeteerPageDriver) {
        super(driver, "http://localhost:5173/join");
        this.elements = new PageElements({
            email: { selector: ".registration.email", type: "input" },
            username: { selector: ".registration.username", type: "input" },
            firstname: { selector: ".registration.first-name", type: "input" },
            lastname: { selector: ".registration.last-name", type: "input" },
            marketingCheckbox: {
                selector: ".registration.marketing-emails",
                type: "checkbox",
            },
            submit: { selector: ".registration.submit-button", type: "button" },
        }, driver);
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