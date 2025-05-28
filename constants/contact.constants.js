export const INVALID_CONTACT_ID = 'Invalid Contact ID';
export const CONTACT_NOT_FOUND = 'Contact Not Found';
export const GET_CONTACT_SUCCESS = 'Contacts fetched successfully';
export const CONTACT_CREATED_SUCCESS = 'Contact created successfully';
export const CONTACT_UPDATED_SUCCESS = 'Contact updated successfully';
export const CONTACT_DELETED_SUCCESS = 'Contact deleted successfully';

export const ALLOWED_CONTACT_SORT_OPTIONS = [
	'id',
	'name',
	'email',
	'message',
	'response',
	'created_by',
	'business_id',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_CONTACT_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_CONTACT_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_CONTACT_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'name',
		type: 'string',
	},
	{
		propertyName: 'email',
		type: 'string',
	},
	{
		propertyName: 'message',
		type: 'string',
	},
	{
		propertyName: 'response',
		type: 'string',
	},
	{
		propertyName: 'created_by',
		type: 'number',
	},
	{
		propertyName: 'business_id',
		type: 'number',
	},
	{
		propertyName: 'status',
		type: 'string',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_CONTACT_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_CONTACT_SORT_OPTIONS.includes(field);
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
