import {JetView} from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const initialLang = this.app.getService("locale").getLang();
		return {
			rows: [
				{
					view: "segmented",
					value: initialLang,
					options: [
						{id: "en", value: "en-US"},
						{id: "ru", value: "ru-RU"}
					],
					on: {
						onChange: id => webix.delay(() => this.SetLocale(id))
					}
				},
				{
					cols: [
						{},
						{}
					]
				}
			]
		};
	}

	SetLocale(locale) {
		this.app.getService("locale").setLang(locale);
	}
}
