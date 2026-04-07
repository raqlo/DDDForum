import {PrismaClient} from "@prisma/client";
import {MarketingRecord} from "../dtos/createMarketingRecord.dto";
import {ContactListAPI} from "./contactListApi";


export class MarketingService {
    private connection: PrismaClient;
    private contactListAPI: ContactListAPI;

    constructor(db: PrismaClient, contactListAPI: ContactListAPI) {
        this.connection = db;
        this.contactListAPI = contactListAPI;
    }

    createMarketingRecord = async ({userId, consent, email}: MarketingRecord & { email: string }) => {
        const marketingRecord = await this.connection.marketing.create({
            data: {
                userId: userId,
                consent: consent
            }
        });

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