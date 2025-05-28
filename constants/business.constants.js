export const INVALID_BUSINESS_ID = 'Invalid Business ID';
export const BUSINESS_NOT_FOUND = 'Business Not Found';
export const GET_BUSINESS_SUCCESS = 'Businesss fetched successfully';
export const BUSINESS_FAVORITED_SUCCESS = 'Business favorited successfully';
export const BUSINESS_FAVORITED_DELETED = 'Business unfavorited successfully';
export const BUSINESS_CREATED_SUCCESS = 'Business created successfully';
export const BUSINESS_UPDATED_SUCCESS = 'Business updated successfully';
export const BUSINESS_DELETED_SUCCESS = 'Business deleted successfully';

export const ALLOWED_BUSINESS_SORT_OPTIONS = [
	'id',
	'name',
	'phone',
	'rating',
	'address',
	'website',
	'description',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_BUSINESS_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_BUSINESS_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_BUSINESS_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'name',
		type: 'string',
	},
	{
		propertyName: 'address',
		type: 'string',
	},
	{
		propertyName: 'phone',
		type: 'string',
	},
	{
		propertyName: 'website',
		type: 'string',
	},
	{
		propertyName: 'description',
		type: 'string',
	},
	{
		propertyName: 'category',
		type: 'number',
	},
	{
		propertyName: 'categories',
		type: 'array',
	},
	{
		propertyName: 'favorite',
		type: 'string',
	},
	{
		propertyName: 'rating',
		type: 'number',
	},
	{
		propertyName: 'verified_status',
		type: 'string',
	},
	{
		propertyName: 'country',
		type: 'string',
	},
	{
		propertyName: 'city',
		type: 'string',
	},
	{
		propertyName: 'postal_code',
		type: 'string',
	},
	{
		propertyName: 'has_reviews',
		type: 'boolean',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_BUSINESS_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_BUSINESS_SORT_OPTIONS.includes(field);
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
