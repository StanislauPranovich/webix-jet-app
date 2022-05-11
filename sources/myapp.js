import {JetApp, EmptyRouter, HashRouter, plugins} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/contacts"
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	const app = new MyApp();
	app.attachEvent("app:error:resolve", () => {
		webix.delay(() => app.show("/top/contacts"));
	});
	webix.ready(() => {
		app.use(plugins.Locale, {
			webix: {
				en: "en-US",
				ru: "ru-RU"
			}
		});
		app.render();
	});
}
