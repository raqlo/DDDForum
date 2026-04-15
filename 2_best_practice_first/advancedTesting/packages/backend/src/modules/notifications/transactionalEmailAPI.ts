import {TransactionalEmailApi} from "./ports/transactionalEmailApi";

export class TransactionalEmailAPI implements TransactionalEmailApi {
  async sendMail(input: { to: string; subject: string; text: string }) {
    console.log(
      `Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );
  }
}
