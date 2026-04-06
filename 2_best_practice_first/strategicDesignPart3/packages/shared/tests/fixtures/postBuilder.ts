import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../backend/src/database";
import { faker } from "@faker-js/faker";

export interface PostInput {
    memberId: number;
    postType: string;
    title: string;
    content: string;
    dateCreated?: Date;
}

export class PostBuilder {
    private connection: PrismaClient;
    private props: Partial<PostInput>;

    constructor() {
        this.connection = prisma;
        this.props = {};
    }

    public withAllRandomDetails(memberId: number) {
        this.props = {
            memberId,
            postType: Math.random() > 0.5 ? 'Text' : 'Link',
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(2),
            dateCreated: faker.date.recent(),
        };
        return this;
    }

    public withMemberId(memberId: number) {
        this.props = {
            ...this.props,
            memberId,
        };
        return this;
    }

    public withPostType(postType: 'Text' | 'Link') {
        this.props = {
            ...this.props,
            postType,
        };
        return this;
    }

    public withTitle(title: string) {
        this.props = {
            ...this.props,
            title,
        };
        return this;
    }

    public withContent(content: string) {
        this.props = {
            ...this.props,
            content,
        };
        return this;
    }

    public withDateCreated(dateCreated: Date) {
        this.props = {
            ...this.props,
            dateCreated,
        };
        return this;
    }

    public build() {
        if (!this.props.memberId) throw new Error('Member ID is required');
        if (!this.props.postType) throw new Error('Post type is required');
        if (!this.props.title) throw new Error('Title is required');
        if (!this.props.content) throw new Error('Content is required');

        return this.connection.post.create({
            data: {
                memberId: this.props.memberId,
                postType: this.props.postType,
                title: this.props.title,
                content: this.props.content,
                ...(this.props.dateCreated && { dateCreated: this.props.dateCreated }),
            },
        });
    }
}
