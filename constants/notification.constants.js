export const INVALID_NOTIFICATION_ID = 'Invalid Notification ID';
export const NOTIFICATION_NOT_FOUND = 'Notification Not Found';
export const GET_NOTIFICATION_SUCCESS = 'Notifications fetched successfully';
export const NOTIFICATION_CREATED_SUCCESS = 'Notification created successfully';
export const NOTIFICATION_UPDATED_SUCCESS = 'Notification updated successfully';
export const NOTIFICATION_DELETED_SUCCESS = 'Notification deleted successfully';

export const ALLOWED_NOTIFICATION_SORT_OPTIONS = [
	'id',
	'user_id',
	'type',
	'message',
	'is_read',
	'created_at',
	'updated_at',
];

const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];
export const INVALID_NOTIFICATION_SORT_OPTION = `Invalid sort options. Allowed sort options are: ${ALLOWED_NOTIFICATION_SORT_OPTIONS.join(
	', ',
)} and Allowed sort direction are: ${ALLOWED_SORT_DIRECTION.join(', ')}`;

export const GET_NOTIFICATION_QUERY_SCHEMA_CONFIG = [
	{
		propertyName: 'user_id',
		type: 'number',
	},
	{
		propertyName: 'type',
		type: 'string',
	},
	{
		propertyName: 'message',
		type: 'string',
	},
	{
		propertyName: 'is_read',
		type: 'string',
	},
	{
		propertyName: 'sort',
		type: 'string',
		test: {
			name: 'is-valid-sort',
			message: INVALID_NOTIFICATION_SORT_OPTION,
			func: value => {
				if (!value) return true;
				const [field, direction] = value.split(':');
				const isValidField = ALLOWED_NOTIFICATION_SORT_OPTIONS.includes(field);
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
