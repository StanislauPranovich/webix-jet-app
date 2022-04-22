import { JetView } from "webix-jet";

export default class ContactsButton extends JetView {
    constructor(app, data, style, active) {
        super(app);
        this.value = data;
        this.style = style;
        this.active = active;
    }
    config() {
        return {
            view: "button",
            value: this.value,
            css: this.style,
            disabled: this.active
        }
    }
}