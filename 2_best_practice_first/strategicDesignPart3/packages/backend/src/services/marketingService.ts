import {prisma} from "../database";
import {PrismaClient} from "@prisma/client";
import {MarketingRecord} from "../dtos/createMarketingRecord.dto";


export class MarketingService {
    private connection: PrismaClient;

    constructor(db: PrismaClient) {
        this.connection = db
    }

    createMarketingRecord = async ({userId, consent}: MarketingRecord) => await this.connection.marketing.create({
        data: {
            userId: userId,  // ✅ Use userId instead of email
            consent: consent
        }
    });

}