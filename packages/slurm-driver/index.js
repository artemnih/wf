const application = require('./dist');

module.exports = application;

if (require.main === module) {
	application.main().catch(err => {
		console.error('Cannot start the application.', err);
		process.exit(1);
	});
}
