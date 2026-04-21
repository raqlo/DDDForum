import {ServerErrorException} from "../../shared/exceptions";
import {ContactListApi} from "./ports/contactListApi";

export class MarketingService {
  constructor(private contactListAPI: ContactListApi) {}

  async addEmailToList(email: string) {
    try {
      return await this.contactListAPI.addEmailToList(email);
    } catch (err) {
      throw new ServerErrorException();
    }
  }
}
