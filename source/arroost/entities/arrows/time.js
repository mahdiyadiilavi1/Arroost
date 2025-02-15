import {
	BLUE,
	GREEN,
	RED,
	WHITE,
	angleBetween,
	distanceBetween,
	rotate,
	subtract,
} from "../../../../libraries/habitat-import.js"
import { shared } from "../../../main.js"
import { createWire } from "../../../nogan/nogan.js"
import { Dom } from "../../components/dom.js"
import { Tunnel } from "../../components/tunnel.js"
import { Entity } from "../entity.js"
import { Line } from "../shapes/line.js"
import { Triangle } from "../shapes/triangle.js"
import { ArrowOfColour } from "./colour.js"
import { ArrowOfTiming } from "./timing.js"

export class ArrowOfTime extends Entity {
	/** @type {Signal<WireColour>} */
	wireColour = this.use("any")

	/**
	 * @param {{
	 * 	id?: WireId
	 *  target: Entity & {dom: Dom, tunnel: Tunnel}
	 *  source: Entity & {dom: Dom, tunnel: Tunnel}
	 *  timing: Timing
	 *  colour: WireColour
	 * }} options
	 */
	constructor({ id, target, source, timing = 0, colour = "any" }) {
		super()

		// Attach components
		this.dom = this.attach(
			new Dom({
				id: "time",
				type: "html",
				// TODO: add cull bounds
			}),
		)
		this.source = source
		this.target = target

		// Setup tunnel
		if (id === undefined) {
			const { wire, operations } = createWire(shared.nogan, {
				source: source.tunnel.id,
				target: target.tunnel.id,
				timing,
				colour,
			})

			this.tunnel = this.attach(new Tunnel(wire.id, { entity: this }))
			Tunnel.apply(() => operations)
		} else {
			this.tunnel = this.attach(new Tunnel(id, { entity: this }))
		}

		// Render elements
		this.line = this.attach(new Line())
		this.flaps = this.attach(new ArrowOfTiming({ wire: this.tunnel.id }))
		this.colour = this.attach(new ArrowOfColour({ wire: this.tunnel.id }))

		shared.scene.layer.timing.append(this.flaps.dom)
		shared.scene.layer.timing.append(this.colour.dom)
		this.dom.append(this.line.dom)
		// this.dom.append(this.flaps.dom)

		// Style elements
		this.flaps.dom.style.fill.set(WHITE.toString())
		this.flaps.dom.transform.scale.set([2 / 3, 2 / 3])
		this.colour.dom.transform.scale.set([2 / 3, 2 / 3])

		this.use(() => {
			switch (this.wireColour.get()) {
				case "red": {
					return this.line.dom.style.stroke.set(RED.toString())
				}
				case "green": {
					return this.line.dom.style.stroke.set(GREEN.toString())
				}
				case "blue": {
					return this.line.dom.style.stroke.set(BLUE.toString())
				}
				default: {
					return this.line.dom.style.stroke.set(WHITE.toString())
				}
			}
		}, [this.wireColour])

		this.reusePosition()
	}

	reusePosition() {
		if (this.positioner !== undefined) {
			this.positioner.dispose()
		}

		this.positioner = this.use(() => {
			const sourcePosition = this.source.dom.transform.absolutePosition.get()
			const targetPosition = this.target.dom.transform.absolutePosition.get()
			const distance = distanceBetween(sourcePosition, targetPosition)

			const angle = angleBetween(sourcePosition, targetPosition)
			const twoThirdsDisplacement = rotate([(distance * 2) / 3, 0], angle)
			const twoThirds = subtract(sourcePosition, twoThirdsDisplacement)
			const thirdDisplacement = rotate([distance / 3, 0], angle)
			const third = subtract(sourcePosition, thirdDisplacement)

			this.line.dom.transform.setAbsolutePosition(sourcePosition)
			this.line.target.setAbsolutePosition(targetPosition)

			this.flaps.dom.transform.setAbsolutePosition(twoThirds)
			this.flaps.dom.transform.rotation.set(angle + Math.PI / 2)

			this.colour.dom.transform.setAbsolutePosition(third)
			this.colour.dom.transform.rotation.set(angle + Math.PI / 2)
		}, [this.target.dom.transform.absolutePosition, this.source.dom.transform.absolutePosition])
	}
}
