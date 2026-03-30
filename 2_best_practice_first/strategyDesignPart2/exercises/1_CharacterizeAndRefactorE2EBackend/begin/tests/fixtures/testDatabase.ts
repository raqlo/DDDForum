import {prisma} from "../../src";
import {Database} from "../../src/database";

export const testDb = new Database(prisma);