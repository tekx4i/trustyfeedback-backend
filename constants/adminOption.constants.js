export const INVALID_ADMIN_OPTION_ID = 'Invalid Admin Option ID';
export const ADMIN_OPTION_NOT_FOUND = 'Admin Option Not Found';
export const GET_ADMIN_OPTION_SUCCESS = 'Admin Options fetched successfully';
export const ADMIN_OPTION_CREATED_SUCCESS = 'Admin Option created successfully';
export const ADMIN_OPTION_UPDATED_SUCCESS = 'Admin Option updated successfully';
export const ADMIN_OPTION_DELETED_SUCCESS = 'Admin Option deleted successfully';

export const ALLOWED_ADMIN_OPTION_SORT_OPTIONS = [
	'id',
	'key',
	'value',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_ADMIN_OPTION_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_ADMIN_OPTION_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_ADMIN_OPTION_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'key',
		type: 'string',
	},
	{
		propertyName: 'value',
		type: 'string',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_ADMIN_OPTION_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_ADMIN_OPTION_SORT_OPTIONS.includes(field);
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
