import {PrismaClient} from "@prisma/client";

export interface MarketingPersistence {
    save: (userId: number, consent: boolean) => Promise<{
        id: number;
        userId: number;
        consent: boolean;
    }>;
}

export class MarketingRepository implements MarketingPersistence {
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