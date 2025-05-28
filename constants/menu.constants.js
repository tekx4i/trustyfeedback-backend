export const INVALID_MENU_ID = 'Invalid Menu ID';
export const MENU_NOT_FOUND = 'Menu Not Found';
export const GET_MENU_SUCCESS = 'Menus fetched successfully';
export const MENU_CREATED_SUCCESS = 'Menu created successfully';
export const MENU_UPDATED_SUCCESS = 'Menu updated successfully';
export const MENU_DELETED_SUCCESS = 'Menu deleted successfully';

export const ALLOWED_MENU_SORT_OPTIONS = [
	'id',
	'name',
	'location',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_MENU_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_MENU_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_MENU_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'name',
		type: 'string',
	},
	{
		propertyName: 'location',
		type: 'string',
	},
	{
		propertyName: 'content',
		type: 'string',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_MENU_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_MENU_SORT_OPTIONS.includes(field);
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
