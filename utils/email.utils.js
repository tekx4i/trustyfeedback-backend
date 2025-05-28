import ElasticMail from 'nodelastic';

import { SMTP_PASS, FROM_NAME, FROM_EMAIL } from '../config';

const client = new ElasticMail(SMTP_PASS);

export const sendEmail = async mailOptions => {
	const maxRetries = 3;
	let attempt = 0;

	while (attempt < maxRetries) {
		try {
			await client.send({
				from: FROM_EMAIL,
				fromName: FROM_NAME,
				subject: mailOptions.subject,
				msgTo: [mailOptions.to],
				bodyHtml: mailOptions.html,
				textHtml: mailOptions.text,
			});
			return; // Success! Exit the function
		} catch (error) {
			attempt++;
			// eslint-disable-next-line no-console
			console.error(`Email sending attempt ${attempt} failed:`, error);

			if (attempt === maxRetries) {
				throw new Error(
					`Failed to send email after ${maxRetries} attempts: ${error.message}`,
				);
			}

			// Wait before retrying (exponential backoff)
			await new Promise(resolve =>
				setTimeout(resolve, 1000 * Math.pow(2, attempt)),
			);
		}
	}
};
