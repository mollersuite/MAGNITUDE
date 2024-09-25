import type { Toast as RaycastToast } from "@raycast/api"
import { $ } from "bun"
import { platform } from "node:process"
enum Style {
	Success = "SUCCESS",
	Failure = "FAILURE",
	Animated = "ANIMATED",
}

class Toast implements RaycastToast {
	#style: RaycastToast.Style = "SUCCESS" as RaycastToast.Style.Success
	#title: string
	#message?: string
	#primaryAction?: RaycastToast.ActionOptions
	#secondaryAction?: RaycastToast.ActionOptions

	// We aren't using these properties, but they are required by typescript to satisfy the type checker
	// Despite adding them to satify the type checker, I get this error:
	// Types have separate declarations of a private property 'options'
	private options: any
	private callbacks: any
	private id: any

	// This is also a required private property, we might use this later idfk
	private update() {}

	static Style = Style
	// There are extensions in Raycast right now that still use this deprecated API. Doesn't matter since we use it internally as well
	constructor(props: RaycastToast.Options) {
		if (props.style) this.style = props.style
		// Satisfy the type checker
		this.#title = props.title
		this.#message = props.message
		this.#primaryAction = props.primaryAction
		this.#secondaryAction = props.secondaryAction
		// The public setters hook up to our UI
		this.title = props.title
		this.message = props.message
		this.primaryAction = props.primaryAction
		this.secondaryAction = props.secondaryAction
	}
	async show() {}
	async hide() {}
	get message() {
		return this.#message
	}
	get primaryAction() {
		return this.#primaryAction
	}
	get secondaryAction() {
		return this.#secondaryAction
	}
	get style() {
		return this.#style
	}
	get title() {
		return this.#title
	}
	set message(message) {
		this.#message = message
	}
	set primaryAction(action) {
		this.#primaryAction = action
	}
	set secondaryAction(action) {
		this.#secondaryAction = action
	}
	set style(style) {
		this.#style = style
	}
	set title(title) {
		this.#title = title
	}
}

const toast = new Toast({
	title: "HELLO MAGNITUDE",
	message: "This is a test",
	style: Style.Success,
})
/*
 export declare function showToast(options: Toast.Options): Promise<Toast>;

 export declare function showToast(style: Toast.Style, title: string, message?: string): Promise<Toast>;

*/

const showToast: typeof import("@raycast/api").showToast = async (
	optionsOrStyle,
	title,
	message
) => {
	if (typeof optionsOrStyle === "string") {
		const toast = new Toast({
			style: optionsOrStyle,
			title: title!,
			message,
		})
		toast.show()
		return toast
	} else {
		const toast = new Toast(optionsOrStyle)
		toast.show()
		return toast
	}
}

async function showInFinder(path) {
	if (platform === "darwin") {
		await $`open -R ${path}`
	} else if (platform === "win32") {
		await $`start explorer ${path}`
	} else if (platform === "linux") {
		await $`xdg-open ${path}`
	} else {
		throw new Error("Unsupported platform")
	}
}

const api = {
	Toast,
	showToast,
	showInFinder
} satisfies typeof import("@raycast/api")

export default api
