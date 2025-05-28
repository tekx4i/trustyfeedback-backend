export const INVALID_BLOG_ID = 'Invalid Blog ID';
export const BLOG_NOT_FOUND = 'Blog Not Found';
export const GET_BLOG_SUCCESS = 'Blogs fetched successfully';
export const BLOG_CREATED_SUCCESS = 'Blog created successfully';
export const BLOG_UPDATED_SUCCESS = 'Blog updated successfully';
export const BLOG_DELETED_SUCCESS = 'Blog deleted successfully';

export const ALLOWED_BLOG_SORT_OPTIONS = [
	'id',
	'title',
	'content',
	'type',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_BLOG_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_BLOG_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_BLOG_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'title',
		type: 'string',
	},
	{
		propertyName: 'content',
		type: 'string',
	},
	{
		propertyName: 'type',
		type: 'string',
	},
	{
		propertyName: 'category_id',
		type: 'number',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_BLOG_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_BLOG_SORT_OPTIONS.includes(field);
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
