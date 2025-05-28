export const INVALID_BLOG_CATEGORY_ID = 'Invalid Blog Category ID';
export const BLOG_CATEGORY_NOT_FOUND = 'Blog Category Not Found';
export const GET_BLOG_CATEGORY_SUCCESS = 'Blog Categories fetched successfully';
export const BLOG_CATEGORY_CREATED_SUCCESS =
	'Blog Category created successfully';
export const BLOG_CATEGORY_UPDATED_SUCCESS =
	'Blog Category updated successfully';
export const BLOG_CATEGORY_DELETED_SUCCESS =
	'Blog Category deleted successfully';

export const ALLOWED_BLOG_CATEGORY_SORT_OPTIONS = [
	'id',
	'name',
	'description',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_BLOG_CATEGORY_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_BLOG_CATEGORY_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_BLOG_CATEGORY_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'name',
		type: 'string',
	},
	{
		propertyName: 'description',
		type: 'string',
	},
	{
		propertyName: 'parent_id',
		type: 'number',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_BLOG_CATEGORY_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_BLOG_CATEGORY_SORT_OPTIONS.includes(field);
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
