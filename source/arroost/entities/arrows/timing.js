import {
	BLACK,
	BLUE,
	CYAN,
	GREY,
	SILVER,
	Splash,
	WHITE,
	equals,
} from "../../../../libraries/habitat-import.js"
import { GREY_SILVER, shared } from "../../../main.js"
import {
	createCell,
	createWire,
	fireCell,
	fullFireCell,
	getCell,
	getWire,
	modifyCell,
	modifyWire,
	t,
} from "../../../nogan/nogan.js"
import { Tunnel } from "../../components/tunnel.js"
import { Dom } from "../../components/dom.js"
import { Entity } from "../entity.js"
import { Ellipse } from "../shapes/ellipse.js"
import { Carry } from "../../components/carry.js"
import { Input } from "../../components/input.js"
import { setCellStyles } from "./shared.js"
import { FULL, HALF, QUARTER, SIXTH, THIRD } from "../../unit.js"
import { triggerCounter } from "../counter.js"
import { EllipseHtml } from "../shapes/ellipse-html.js"
import { Triangle } from "../shapes/triangle.js"
import { ArrowOfConnection } from "./connection.js"
import { getNextTiming } from "../../../nogan/behave.js"

export class ArrowOfTiming extends Entity {
	/** @type {Signal<Timing>} */
	timing = this.use(0)

	/**
	 * @param {{
	 * 	id?: CellId
	 * 	position?: [number, number]
	 *  wire: WireId
	 * }} options
	 */
	constructor({ position = t([0, 0]), id, wire }) {
		super()

		triggerCounter()

		if (id === undefined) {
			const cell = createCell(shared.nogan, { type: "timing" })
			const wireWire = getWire(shared.nogan, wire)
			Tunnel.apply(() => {
				const operations = modifyCell(shared.nogan, {
					id: cell.id,
					wire,
				})
				const wireOperations = modifyWire(shared.nogan, {
					id: wire,
					cells: [...wireWire.cells, cell.id],
				})
				operations.push(...wireOperations)
				return operations
			})
			id = cell.id
		}

		// Attach components
		this.input = this.attach(new Input(this))
		this.tunnel = this.attach(new Tunnel(id, { destroyable: true, entity: this }))
		this.dom = this.attach(
			new Dom({
				id: "timing",
				type: "html",
				input: this.input,
				position,
				cullBounds: [(FULL * 2) / 3, (FULL * 2) / 3],
			}),
		)

		// Render elements
		this.back = this.attach(new EllipseHtml({ input: this.input }))
		this.front = this.attach(new Triangle())
		this.delayFront = this.attach(new Triangle())
		this.earlyFront = this.attach(new Ellipse())
		this.earlyFrontFront = this.attach(new Triangle())

		this.dom.append(this.back.dom)
		this.dom.append(this.front.dom)
		this.dom.append(this.delayFront.dom)
		this.dom.append(this.earlyFront.dom)
		this.dom.append(this.earlyFrontFront.dom)

		// Style elements
		this.back.dom.transform.scale.set([2 / 3, 2 / 3])
		this.front.dom.transform.scale.set([1 / 3, 1 / 3])
		this.earlyFrontFront.dom.transform.scale.set([1 / 4, 1 / 4])
		this.delayFront.dom.transform.scale.set([1 / 4, 1 / 4])
		this.earlyFront.dom.transform.scale.set([((2 / 3) * 2) / 3, ((2 / 3) * 2) / 3])
		// this.earlyFront.dom.transform.scale.set([1 / 7, 1 / 7])
		// this.front.dom.transform.position.set([0, (FULL - Triangle.HEIGHT) / 2])

		setCellStyles({
			back: this.back.dom,
			front: this.front.dom,
			input: this.input,
			tunnel: this.tunnel,
		})
		this.timing.set(getWire(shared.nogan, wire).timing)
		this.use(() => {
			if (this.timing.get() !== 1) return
			this.delayFront.dom.style.fill.set(this.back.dom.style.fill.get())
		}, [this.timing, this.back.dom.style.fill])

		this.use(() => {
			if (this.timing.get() !== -1) return
			this.earlyFrontFront.dom.style.fill.set(this.back.dom.style.fill.get())
		}, [this.timing, this.back.dom.style.fill])

		this.use(() => {
			if (this.timing.get() !== -1) return
			this.earlyFront.dom.style.fill.set(this.front.dom.style.fill.get())
		}, [this.timing, this.front.dom.style.fill])

		this.use(() => {
			const timing = this.timing.get()
			if (timing === 1) {
				this.delayFront.dom.style.visibility.set("inherit")
			} else {
				this.delayFront.dom.style.visibility.set("hidden")
			}
		}, [this.timing])

		this.use(() => {
			const timing = this.timing.get()
			if (timing === -1) {
				this.earlyFront.dom.style.visibility.set("inherit")
				this.earlyFrontFront.dom.style.visibility.set("inherit")
			} else {
				this.earlyFront.dom.style.visibility.set("hidden")
				this.earlyFrontFront.dom.style.visibility.set("hidden")
			}
		}, [this.timing])

		// Nogan behaviours
		const pointing = this.input.state("pointing")
		pointing.pointerup = this.onClick.bind(this)
		pointing.pointermove = this.onPointingPointerMove.bind(this)
		this.wire = wire
		// const _wire = getWire(shared.nogan, wire)
		// Tunnel.apply(() => {
		// 	const { wire: sourceWire, operations } = createWire(shared.nogan, {
		// 		target: _wire.source,
		// 		source: id,
		// 	})
		// 	this.sourceWire = sourceWire.id
		// 	return operations
		// })
		// Tunnel.apply(() => {
		// 	const { wire: targetWire, operations } = createWire(shared.nogan, {
		// 		target: _wire.target,
		// 		source: id,
		// 	})
		// 	this.sourceWire = targetWire.id
		// 	return operations
		// })
	}

	onPointingPointerMove() {
		// todo: drag the whole wire(s)?
		return null
	}

	onClick(e) {
		switch (this.timing.get()) {
			case 0: {
				this.timing.set(1)
				break
			}
			case 1: {
				this.timing.set(-1)
				break
			}
			case -1: {
				this.timing.set(0)
				break
			}
		}

		ArrowOfConnection.timing = this.timing.get()

		Tunnel.perform(() => {
			const wire = getWire(shared.nogan, this.wire)
			if (!wire) throw new Error(`Couldn't find wire ${this.wire}`)
			const timing = this.timing.get()
			this.timing.set(timing)
			const fireOperations = fullFireCell(shared.nogan, { id: this.tunnel.id })
			const modifyOperations = modifyWire(shared.nogan, { id: wire.id, timing })
			fireOperations.push(...modifyOperations)
			return fireOperations
		})
	}
}
