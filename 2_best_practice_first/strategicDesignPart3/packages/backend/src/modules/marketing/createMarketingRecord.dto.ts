import {isMissingKeys} from "../../shared/utils";
import {InvalidRequestBodyException} from "../../shared/errors/exceptions";

export type MarketingRecord = {
    userId: number;
    consent: boolean;
}

export class CreateMarketingRecordDto {
    constructor(public userId: MarketingRecord["userId"], public consent: MarketingRecord["consent"]) {
    }

    static fromRequest(body: unknown) {
        const requiredKeys = ["userId", "consent"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException();
        }

        const {userId, consent} = body as MarketingRecord;
        return new CreateMarketingRecordDto(userId, consent);
    }
}