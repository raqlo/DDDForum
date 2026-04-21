import {ContactListApi} from "./ports/contactListApi";

export class ContactListAPI implements ContactListApi {
  async addEmailToList(email: string): Promise<boolean> {
    // Do the actual work
    console.log(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );
    return true;
  }
}
