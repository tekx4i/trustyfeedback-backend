export const INVALID_CATEGORY_ID = 'Invalid Category ID';
export const CATEGORY_NOT_FOUND = 'Category Not Found';
export const CATEGORY_EXISTS = 'Category already exists';
export const GET_CATEGORY_SUCCESS = 'Categories fetched successfully';
export const CATEGORY_CREATED_SUCCESS = 'Category created successfully';
export const CATEGORY_UPDATED_SUCCESS = 'Category updated successfully';
export const CATEGORY_DELETED_SUCCESS = 'Category deleted successfully';

export const ALLOWED_CATEGORY_SORT_OPTIONS = [
	'id',
	'name',
	'description',
	'parent_id',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_CATEGORY_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_CATEGORY_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_CATEGORY_QUERY_SCHEMA_CONFIG = [
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
		propertyName: 'has_business',
		type: 'boolean',
	},
	{
		propertyName: 'is_parent',
		type: 'boolean',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_CATEGORY_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_CATEGORY_SORT_OPTIONS.includes(field);
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
