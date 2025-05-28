export const INVALID_BADGE_ID = 'Invalid Badge ID';
export const BADGE_NOT_FOUND = 'Badge Not Found';
export const GET_BADGE_SUCCESS = 'Badges fetched successfully';
export const BADGE_CREATED_SUCCESS = 'Badge created successfully';
export const BADGE_UPDATED_SUCCESS = 'Badge updated successfully';
export const BADGE_DELETED_SUCCESS = 'Badge deleted successfully';

export const ALLOWED_BADGE_SORT_OPTIONS = [
	'id',
	'name',
	'description',
	'success_percentage',
	'success_count',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_BADGE_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_BADGE_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_BADGE_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'name',
		type: 'string',
	},
	{
		propertyName: 'description',
		type: 'string',
	},
	{
		propertyName: 'success_percentage',
		type: 'number',
	},
	{
		propertyName: 'success_count',
		type: 'number',
	},
	{
		propertyName: 'auto_approve',
		type: 'boolean',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_BADGE_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_BADGE_SORT_OPTIONS.includes(field);
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
