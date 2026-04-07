import {PrismaClient} from "@prisma/client";
import {MarketingRecord} from "../dtos/createMarketingRecord.dto";
import {ContactListAPI} from "./contactListApi";
import {MarketingRepository} from "../repository/marketingRepository";

export class MarketingService {

    constructor(private contactListAPI: ContactListAPI, private marketingRepository: MarketingRepository) {
    }

    createMarketingRecord = async ({userId, consent, email}: MarketingRecord & { email: string }) => {

        const marketingRecord = await this.marketingRepository.save(userId, consent);

        if (consent) {
            try {
                await this.contactListAPI.addEmailToList(email);
            } catch (error) {
                // Graceful degradation: log the error but don't fail the request
                // The database record is still saved, we can retry the sync later
                console.error(`[MarketingService] Failed to add ${email} to external list:`, error);
            }
        }

        return marketingRecord;
    };

}