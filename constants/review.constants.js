export const INVALID_REVIEW_ID = 'Invalid Review ID';
export const REVIEW_NOT_FOUND = 'Review Not Found';
export const GET_REVIEW_SUCCESS = 'Reviews fetched successfully';
export const REVIEW_FAVORITED_SUCCESS = 'Review favorited successfully';
export const REVIEW_FAVORITED_DELETED = 'Review unfavorited successfully';
export const REVIEW_ALREADY_SUBMITTED = 'Review already submitted';
export const REVIEW_VERIFIED_SUCCESS = 'Review verified successfully';
export const REVIEW_CREATED_SUCCESS = 'Review created successfully';
export const REVIEW_UPDATED_SUCCESS = 'Review updated successfully';
export const REVIEW_DELETED_SUCCESS = 'Review deleted successfully';

export const ALLOWED_REVIEW_SORT_OPTIONS = [
	'id',
	'rating',
	'title',
	'comment',
	'user_id',
	'business_id',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_REVIEW_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_REVIEW_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_REVIEW_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'rating',
		type: 'number',
	},
	{
		propertyName: 'title',
		type: 'string',
	},
	{
		propertyName: 'comment',
		type: 'string',
	},
	{
		propertyName: 'user_id',
		type: 'number',
	},
	{
		propertyName: 'business_id',
		type: 'number',
	},
	{
		propertyName: 'created_at',
		type: 'string',
	},
	{
		propertyName: 'favorite',
		type: 'string',
	},
	{
		propertyName: 'approved',
		type: 'string',
	},
	{
		propertyName: 'comments',
		type: 'string',
	},
	{
		propertyName: 'verified_status',
		type: 'string',
	},
	{
		propertyName: 'status',
		type: 'string',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_REVIEW_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_REVIEW_SORT_OPTIONS.includes(field);
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
