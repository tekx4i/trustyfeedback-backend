export const INVALID_REVIEW_REPORT_ID = 'Invalid Review Report ID';
export const REVIEW_REPORT_NOT_FOUND = 'Review Report Not Found';
export const GET_REVIEW_REPORT_SUCCESS = 'Review Reports fetched successfully';
export const REVIEW_REPORT_CREATED_SUCCESS =
	'Review Report created successfully';
export const REVIEW_REPORT_UPDATED_SUCCESS =
	'Review Report updated successfully';
export const REVIEW_REPORT_DELETED_SUCCESS =
	'Review Report deleted successfully';

export const ALLOWED_REVIEW_REPORT_SORT_OPTIONS = [
	'id',
	'review_id',
	'reported_by',
	'reason',
	'status',
	'created_at',
	'resolved_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_REVIEW_REPORT_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_REVIEW_REPORT_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_REVIEW_REPORT_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'review_id',
		type: 'number',
	},
	{
		propertyName: 'reported_by',
		type: 'number',
	},
	{
		propertyName: 'reason',
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
			message: INVALID_REVIEW_REPORT_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_REVIEW_REPORT_SORT_OPTIONS.includes(field);
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
