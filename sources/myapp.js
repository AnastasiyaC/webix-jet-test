import {JetApp, EmptyRouter, HashRouter} from "webix-jet";
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

		this.attachEvent("app:error:resolve", () => {
			webix.delay(() => this.app.show("/top/contacts"));
		});
	}
}

if (!BUILD_AS_MODULE) {
	const app = new MyApp();
	webix.ready(() => app.render());
}
