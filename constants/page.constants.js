export const INVALID_PAGE_ID = 'Invalid Page ID';
export const PAGE_NOT_FOUND = 'Page Not Found';
export const GET_PAGE_SUCCESS = 'Pages fetched successfully';
export const PAGE_CREATED_SUCCESS = 'Page created successfully';
export const PAGE_UPDATED_SUCCESS = 'Page updated successfully';
export const PAGE_DELETED_SUCCESS = 'Page deleted successfully';

export const ALLOWED_PAGE_SORT_OPTIONS = [
	'id',
	'slug',
	'title',
	'content',
	'isActive',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_PAGE_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_PAGE_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_PAGE_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'title',
		type: 'string',
	},
	{
		propertyName: 'slug',
		type: 'string',
	},
	{
		propertyName: 'content',
		type: 'string',
	},
	{
		propertyName: 'author_id',
		type: 'number',
	},
	{
		propertyName: 'isActive',
		type: 'number',
	},
	{
		propertyName: 'type',
		type: 'string',
	},
	{
		propertyName: 'url',
		type: 'string',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_PAGE_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_PAGE_SORT_OPTIONS.includes(field);
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
