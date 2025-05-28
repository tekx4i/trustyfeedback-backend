import escape from 'escape-html';
import yup from 'yup';

const baseSchema = {
	string: yup
		.string()
		.transform(value => (typeof value === 'string' ? escape(value) : value))
		.trim(),
	number: yup
		.number()
		.transform(value =>
			typeof value === 'string' ? value.replace(/\D/g, '') : value,
		)
		.typeError('The field must be a number'),
	array: yup.array().transform(value => {
		if (typeof value === 'string') {
			try {
				if (value.startsWith('[') && value.endsWith(']')) {
					return JSON.parse(value);
				}
				return value.split(',').map(item => item.trim());
			} catch (e) {
				return value;
			}
		}
		return value;
	}),
};

export const createQueryParamsSchema = schemaFields => {
	const shape = {};

	schemaFields.forEach(field => {
		let validator = baseSchema[field.type];

		if (validator) {
			validator = validator.clone();
		} else {
			validator = yup
				.string()
				.transform(value => (typeof value === 'string' ? escape(value) : value))
				.trim();
		}

		if (field.transform) {
			validator = validator.transform(field.transform);
		}

		if (field.min !== undefined) {
			validator = validator.min(field.min);
		}

		if (field.max !== undefined) {
			validator = validator.max(field.max);
		}

		if (field.test) {
			const { name, message, func } = field.test;
			validator = validator.test(name, message, func);
		}

		if (field.required) {
			validator = validator.required();
		}

		shape[field.propertyName] = validator;
	});

	return yup.object().shape(shape);
};
