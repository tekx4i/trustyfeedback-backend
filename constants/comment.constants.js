export const INVALID_COMMENT_ID = 'Invalid Comment ID';
export const COMMENT_NOT_FOUND = 'Comment Not Found';
export const GET_COMMENT_SUCCESS = 'Comments fetched successfully';
export const COMMENT_CREATED_SUCCESS = 'Comment created successfully';
export const COMMENT_UPDATED_SUCCESS = 'Comment updated successfully';
export const COMMENT_DELETED_SUCCESS = 'Comment deleted successfully';

export const ALLOWED_COMMENT_SORT_OPTIONS = [
	'id',
	'content',
	'author_id',
	'parent_id',
	'business_id',
	'blog_id',
	'review_id',
	'story_id',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_COMMENT_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_COMMENT_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_COMMENT_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'content',
		type: 'string',
	},
	{
		propertyName: 'author_id',
		type: 'number',
	},
	{
		propertyName: 'parent_id',
		type: 'number',
	},
	{
		propertyName: 'business_id',
		type: 'number',
	},
	{
		propertyName: 'blog_id',
		type: 'number',
	},
	{
		propertyName: 'review_id',
		type: 'number',
	},
	{
		propertyName: 'story_id',
		type: 'number',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_COMMENT_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_COMMENT_SORT_OPTIONS.includes(field);
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
