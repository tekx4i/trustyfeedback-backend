import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import responseTime from 'response-time';

import { PORT } from './config';
import {
	errorMiddleware,
	notFound,
	// rateLimiter
} from './middlewares';
import {
	AuthRoutes,
	RoleRoutes,
	UserRoutes,
	BlogRoutes,
	PageRoutes,
	MenuRoutes,
	LikeRoutes,
	BadgeRoutes,
	StoryRoutes,
	ReviewRoutes,
	ContactRoutes,
	PackageRoutes,
	CommentRoutes,
	PaymentRoutes,
	CategoryRoutes,
	BusinessRoutes,
	AdminOptionRoutes,
	BlogCategoryRoutes,
	ReviewReportRoutes,
	NotificationRoutes,
} from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(rateLimiter);
app.use(compression());
app.use(morgan('dev'));
app.use(responseTime());

app.use(cors({ origin: '*' }));

app.use('/public', express.static(path.join(path.resolve(), 'temp_uploads')));
app.use(express.static(path.join(path.resolve(), 'public')));

app.use(helmet());

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/badge', BadgeRoutes);
app.use('/api/v1/business', BusinessRoutes);
app.use('/api/v1/blog/category', BlogCategoryRoutes);
app.use('/api/v1/blog', BlogRoutes);
app.use('/api/v1/category', CategoryRoutes);
app.use('/api/v1/comment', CommentRoutes);
app.use('/api/v1/contact', ContactRoutes);
app.use('/api/v1/like', LikeRoutes);
app.use('/api/v1/menu', MenuRoutes);
app.use('/api/v1/notification', NotificationRoutes);
app.use('/api/v1/option', AdminOptionRoutes);
app.use('/api/v1/package', PackageRoutes);
app.use('/api/v1/page', PageRoutes);
app.use('/api/v1/payment', PaymentRoutes);
app.use('/api/v1/review/report', ReviewReportRoutes);
app.use('/api/v1/review', ReviewRoutes);
app.use('/api/v1/role', RoleRoutes);
app.use('/api/v1/story', StoryRoutes);
app.use('/api/v1/user', UserRoutes);

app.get('/home', (req, res) => {
	res.status(200).json({ data: 'Server is running' });
});

// app.get('/foldertest', (req, res) => {
// 	const crudName = 'badge';
// 	const replacements = ['Badge', 'BADGE', 'badge', '.badge.'];
// 	const folders = [
// 		'constants',
// 		'controllers',
// 		'routes',
// 		'validations',
// 		'services',
// 	];

// 	folders.forEach(folder => {
// 		const sourceFilePath = path.join(__dirname, folder, `spice.${folder}.js`);
// 		const destinationFileName = `${crudName}.${folder}.js`;
// 		const destinationFilePath = path.join(
// 			__dirname,
// 			folder,
// 			destinationFileName,
// 		);
// 		const indexFilePath = path.join(__dirname, folder, 'index.js');

// 		fs.copyFile(sourceFilePath, destinationFilePath, err => {
// 			if (err) {
// 				console.error(`Error copying file in ${folder}:`, err);
// 			} else {
// 				console.log(`File copied in ${folder} as ${destinationFileName}`);

// 				fs.readFile(destinationFilePath, 'utf8', (readErr, data) => {
// 					if (readErr) {
// 						console.error(`Error reading file in ${folder}:`, readErr);
// 					} else {
// 						const updatedContent = data
// 							.replace(/\.spices\./g, replacements[3])
// 							.replace(/Spice/g, replacements[0])
// 							.replace(/SPICE/g, replacements[1])
// 							.replace(/spice/g, replacements[2]);

// 						fs.writeFile(
// 							destinationFilePath,
// 							updatedContent,
// 							'utf8',
// 							writeErr => {
// 								if (writeErr) {
// 									console.error(`Error writing file in ${folder}:`, writeErr);
// 								} else {
// 									console.log(`File updated in ${folder} with replacements`);

// 									const exportLine = `export * from './${crudName}.${folder}';\n`;
// 									fs.appendFile(indexFilePath, exportLine, appendErr => {
// 										if (appendErr) {
// 											console.error(
// 												`Error appending to index.js in ${folder}:`,
// 												appendErr,
// 											);
// 										} else {
// 											console.log(`Export line added to index.js in ${folder}`);
// 										}
// 									});
// 								}
// 							},
// 						);
// 					}
// 				});
// 			}
// 		});
// 	});

// 	res
// 		.status(200)
// 		.json({
// 			data: 'Files copied, updated, and export line added successfully',
// 		});
// });

app.use('*', notFound);
app.use(errorMiddleware);

if (!fs.existsSync('./temp_uploads')) {
	fs.mkdirSync('./temp_uploads', { recursive: true });
}

app.listen(PORT || 3000, () => {
	// eslint-disable-next-line no-console
	console.log(`Server is listening at port ${PORT}`);
});
