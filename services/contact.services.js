import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { SUPPORT_EMAIL, ADMIN_EMAIL } from '../config';
import { CONTACT_NOT_FOUND } from '../constants';
import { AppError } from '../errors';
import { notification } from '../utils';

const prisma = new PrismaClient();

export class ContactService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllContacts() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				is_deleted: false,
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'created_by' || key === 'business_id') {
					return { [key]: search[key] };
				}
				return { [key]: { contains: search[key] } };
			});
		}
		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
			];
		}

		const totalCount = await prisma.contact.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;

		const allRecords = await prisma.contact.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(CONTACT_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getContact() {
		const { id } = this.req.params;
		const record = await prisma.contact.findUnique({
			where: {
				is_deleted: false,
				id: parseInt(id, 10),
			},
		});
		if (!record || !record.id)
			throw new AppError(CONTACT_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createContact() {
		const { body, user } = this.req;

		const record = await prisma.contact.create({
			data: {
				...(user ? { created_by: user.id } : {}),
				...body,
			},
		});

		const data = {
			subject: 'Support Center',
			name: body.name,
			message: `Thank you for reaching out to us! We have received your query, and our support team is currently reviewing it.</br>One of our team members will contact you shortly to assist you further. We aim to provide you with the best support and ensure all your questions are answered as quickly as possible.<br>If you need immediate assistance, feel free to contact us at ${SUPPORT_EMAIL}`,
		};
		notification({ email: body.email }, 'mail', data);

		if (body.business_id) {
			const businessUser = await prisma.user.findFirst({
				where: {
					business_id: body.business_id,
				},
			});
			if (businessUser) {
				const adminData = {
					subject: 'New Contact Us Query',
					name: businessUser.name,
					message: `<h3>You have received a new query from the Contact Us form:</h3>
							<p><strong>Name:</strong> ${body.name}</p>
							<p><strong>Email:</strong> ${body.email}</p>
							<p><strong>Message:</strong> ${body.message}</p>`,
				};
				notification(
					{ email: businessUser.email },
					'mail',
					adminData,
					'rawMessage',
				);
			}
		} else {
			const adminData = {
				subject: 'New Contact Us Query',
				name: 'Admin',
				message: `<h3>You have received a new query from the Contact Us form:</h3>
						<p><strong>Name:</strong> ${body.name}</p>
						<p><strong>Email:</strong> ${body.email}</p>
						<p><strong>Message:</strong> ${body.message}</p>`,
			};
			notification({ email: ADMIN_EMAIL }, 'mail', adminData, 'rawMessage');
		}

		return { record };
	}

	async updateContact() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.contact.update({
			where: {
				is_deleted: false,
				id: parseInt(id, 10),
			},
			data: body,
		});

		if(updateRecord.email){
			const data = {
				subject: 'Re: Your Query - Support Center Response',
				name: updateRecord.name,
				message: `
				We wanted to inform you that our support team has responded to your query. Below is the response:
				</br></br>
				<strong>Admin Response:</strong><br>${updateRecord.response}
				</br></br>
				If you have any further questions or need more assistance, feel free to reach out to us at ${SUPPORT_EMAIL}. We're here to help!`,
			};
			notification({ email: updateRecord.email }, 'mail', data);
		}

		return updateRecord;
	}

	async deleteContact() {
		const { id } = this.req.params;

		await prisma.contact.update({
			where: {
				is_deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				is_deleted: true,
			},
		});

		return null;
	}

	async deleteManyContact() {
		const { ids } = this.req.body;

		await prisma.contact.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				is_deleted: true,
			},
		});

		return null;
	}
}
