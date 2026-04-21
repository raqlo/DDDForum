export class TransactionalEmailApi {
    sendWelcomeEmail(to: string, subject: string, message: number) {
        console.log(`[TransactionalEmailApi] Sending welcome email to ${to} with subject ${subject} and message ${message}`);
    }
}