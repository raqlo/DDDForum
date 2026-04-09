import { TransactionalEmailApi } from "./transactionalEmailApi";

export class NotificationsModule {
    private transactionalEmailAPI: TransactionalEmailApi;

    private constructor() {
        this.transactionalEmailAPI = this.createTransactionalEmailAPI();
    }

    static build() {
        return new NotificationsModule();
    }

    public getTransactionalEmailAPI() {
        return this.transactionalEmailAPI;
    }

    private createTransactionalEmailAPI() {
        return new TransactionalEmailApi();
    }
}
