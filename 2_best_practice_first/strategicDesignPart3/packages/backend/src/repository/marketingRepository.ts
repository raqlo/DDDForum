import {PrismaClient} from "@prisma/client";

export class MarketingRepository {
    private connection: PrismaClient = this.db;

    constructor(private db: PrismaClient) {
    }

    save = async (userId: number, consent: boolean) => {
        return this.db.marketing.create({
            data: {
                userId: userId,
                consent: consent
            }
        });
    }
}