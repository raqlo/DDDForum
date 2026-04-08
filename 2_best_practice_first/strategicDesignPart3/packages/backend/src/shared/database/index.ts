import {UserPersistence, UserRepository} from "../../repository/userRepo";
import {PostPersistence, PostRepository} from "../../repository/postRepository";
import {MarketingRepository} from "../../repository/marketingRepository";
import {PrismaClient} from "@prisma/client";

export class Database {
   public users: UserPersistence;
   public posts: PostPersistence;
   public marketing: MarketingRepository;

    constructor(private prisma: PrismaClient) {
        this.users = new UserRepository(prisma);
        this.posts = new PostRepository(prisma);
        this.marketing = new MarketingRepository(prisma);
    }
}