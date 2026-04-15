import { TransactionalEmailApi } from "./ports/transactionalEmailApi";
import {TransactionalEmailAPI} from "./transactionalEmailAPI";

export class NotificationsModule {
  private readonly transactionalEmailAPI: TransactionalEmailApi;

  private constructor() {
    this.transactionalEmailAPI = this.createTransactionalEmailAPI();
  }

  static build() {
    return new NotificationsModule();
  }

  private createTransactionalEmailAPI(): TransactionalEmailApi {
    return new TransactionalEmailAPI();
  }

  public getTransactionalEmailAPI(): TransactionalEmailApi {
    return this.transactionalEmailAPI;
  }
}
