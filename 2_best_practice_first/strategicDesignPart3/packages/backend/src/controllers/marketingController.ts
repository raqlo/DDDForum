import {Request, Response} from "express";
import {isMissingKeys} from "../shared/utils";
import {Errors} from "../shared/errors";
import {prisma} from "../database";

export class MarketingController {
    addUserToMarketingList = async (req: Request, res: Response) => {
        const keyIsMissing = isMissingKeys(req.body,
            ['userId', 'consent']
        );

        if (keyIsMissing) {
            return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false})
        }

        const {userId, consent} = req.body;

        // Find the user by email
        const user = await prisma.user.findFirst({where: {id: userId}});

        if (!user) {
            return res.status(404).json({error: Errors.UserNotFound, data: undefined, success: false})
        }

        // Create marketing record with userId, not email
        const marketing = await prisma.marketing.create({
            data: {
                userId: userId,  // ✅ Use userId instead of email
                consent: consent
            }
        })
        return res.status(201).json({error: undefined, data: marketing, success: true});
    }
}
