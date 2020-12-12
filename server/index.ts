if (!process.env.IS_TS_NODE) {
  // tslint:disable-next-line:no-var-requires
  require('module-alias/register');
}
import Server from '@core/Server'
import Socket from '@core/Socket'

(async () => {
  try {
    let server = new Server();
    await server.start()
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();