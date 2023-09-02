import { add, use, WHITE } from "../../../libraries/habitat-import.js"
import { shared } from "../../main.js"
import { Dom } from "../components/dom.js"
import { Entity } from "./entity.js"

const count = use(2)
export const triggerCounter = () => {
	count.set(count.get() + 1)
}

export class Counter extends Entity {
	constructor() {
		super()
		this.dom = this.attach(new Dom({ id: "counter", type: "html" }))
		this.dom.render = this.render.bind(this)
	}

	render() {
		this.div = document.createElement("div")
		this.div.style["color"] = WHITE.toString()
		this.div.style["width"] = "100vw"
		this.div.style["height"] = "100vh"
		this.div.style["font-size"] = "50px"
		this.div.style["font-family"] = "Rosario"
		this.div.style["user-select"] = "none"
		this.dom.style.pointerEvents.set("none")
		this.use(() => {
			if (!this.div) return
			this.div.innerText = count.get().toString()
		})
		this.tickListener = this.listen("tick", this.tick.bind(this))
		return this.div
	}

	tick() {
		this.dom.transform.position.set(
			add(shared.pointer.transform.absolutePosition.get(), [20, 20]),
		)
	}
}