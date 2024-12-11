import prisma from './prisma';
import db from './db.json';

(async () => {
	await prisma.product.createMany({
		data: db,
	});
})()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (err) => {
		console.error(err);
		await prisma.$disconnect();
		process.exit(1);
	});
