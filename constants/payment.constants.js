export const INVALID_PAYMENT_ID = 'Invalid Payment ID';
export const PAYMENT_NOT_FOUND = 'Payment Not Found';
export const GET_PAYMENT_SUCCESS = 'Payments fetched successfully';
export const PAYMENT_CREATED_SUCCESS = 'Payment created successfully';
export const PAYMENT_UPDATED_SUCCESS = 'Payment updated successfully';
export const PAYMENT_DELETED_SUCCESS = 'Payment deleted successfully';

export const PAYMENT_STATUS = {
	PENDING: 'PENDING',
	PROCESSING: 'PROCESSING',
	INPROGRESS: 'IN-PROGRESS',
	FAILED: 'FAILED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
};

export const ALLOWED_PAYMENT_SORT_OPTIONS = [
	'id',
	'amount',
	'status',
	'description',
	'type',
	'created_by',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_PAYMENT_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_PAYMENT_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_PAYMENT_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'amount',
		type: 'number',
	},
	{
		propertyName: 'status',
		type: 'string',
	},
	{
		propertyName: 'description',
		type: 'string',
	},
	{
		propertyName: 'type',
		type: 'string',
	},
	{
		propertyName: 'created_by',
		type: 'number',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_PAYMENT_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_PAYMENT_SORT_OPTIONS.includes(field);
				const isValidDirection = ALLOWED_SORT_DIRECTION.includes(direction);
				return isValidField && isValidDirection;
			},
		},
	},
	{
		propertyName: 'page',
		type: 'number',
		min: 1,
	},
	{
		propertyName: 'limit',
		type: 'number',
		min: 1,
	},
];
