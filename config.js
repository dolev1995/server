const path = require("path"),
	domains = ['localhost:3000'],
	dotenv = require('dotenv');
	dotenv.config();
// TODO: change to mongodb://localhost:27017/beracha

// module.exports = {
// 	DBconn: process.env.DBconn,
// 	port: process.env.PORT || 1337,
// 	clientPath: path.join(__dirname, '..', 'prod', 'client'),
// 	adminPath: path.join(__dirname, '..', 'prod', 'admin'),
// 	assetsPath: path.join(__dirname, '..', 'prod', 'assets'),
// 	trusted: (origin = '') => domains.reduce((acc, curr) => acc || origin.includes(curr), false),
// 	adminEmail: 'hodaot@yhb.org.il',
// 	adminDomain : 'https://test.yhb.org.il/admin/#'
// };

module.exports = {
    //...
   // devServer: {
    disableHostCheck: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port:process.env.PORT || 3000,
    //}
    
  };
