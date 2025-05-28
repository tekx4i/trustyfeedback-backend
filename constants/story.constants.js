export const INVALID_STORY_ID = 'Invalid Story ID';
export const STORY_NOT_FOUND = 'Story Not Found';
export const GET_STORY_SUCCESS = 'Stories fetched successfully';
export const STORY_CREATED_SUCCESS = 'Story created successfully';
export const STORY_UPDATED_SUCCESS = 'Story updated successfully';
export const STORY_DELETED_SUCCESS = 'Story deleted successfully';

export const ALLOWED_STORY_SORT_OPTIONS = [
	'id',
	'title',
	'content',
	'author_id',
	'isActive',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_STORY_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_STORY_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_STORY_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'title',
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
		type: 'boolean',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_STORY_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_STORY_SORT_OPTIONS.includes(field);
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
