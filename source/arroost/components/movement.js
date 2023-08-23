import { add, clamp, equals } from "../../../libraries/habitat-import.js"
import { c, t } from "../../nogan/nogan.js"
import { Component } from "./component.js"
import { Transform } from "./transform.js"

export const Movement = class extends Component {
	/** @param {Transform} transform */
	constructor(transform) {
		super()
		this.transform = transform
		this.velocity = this.use(t([0, 0]))
		this.acceleration = this.use(t([0, 0]))
		this.friction = this.use(t([1, 1]))

		this.absoluteVelocity = this.use(() => this.getAbsoluteVelocity())

		this.scaleVelocity = this.use(t([1, 1]))
		this.scaleAcceleration = this.use(t([1, 1]))

		this.minVelocity = this.use(t([0, 0]))
		this.maxVelocity = this.use(t([Infinity, Infinity]))
		this.minVelocityThreshold = this.use(t([0.05, 0.05]))
		this.maxVelocityThreshold = this.use(t([Infinity, Infinity]))
	}

	/**
	 * Get the velocity, scaled by the parent's scale.
	 * @returns {[number, number]}
	 */
	getAbsoluteVelocity() {
		const [x, y] = this.velocity.get()
		const [sx, sy] = this.transform.parent?.scale.get() ?? [1, 1]
		return [x * sx, y * sy]
	}

	/**
	 * Set the velocity, scaled by the parent's scale.
	 * @param {[number, number]} vector
	 */
	setAbsoluteVelocity([x, y]) {
		const [sx, sy] = this.transform.parent?.scale.get() ?? [1, 1]
		this.velocity.set([x / sx, y / sy])
	}

	/**
	 * @param {Vector2D} vector
	 * @param {Vector2D} min
	 * @param {Vector2D} max
	 * @param {Vector2D} minThreshold
	 * @param {Vector2D} maxThreshold
	 */
	static snap(vector, min, max, minThreshold, maxThreshold) {
		const abs = c([Math.abs(vector.x), Math.abs(vector.y)])
		const sign = c([Math.sign(vector.x), Math.sign(vector.y)])
		return c([
			(abs.x < minThreshold.x ? min.x : abs.x > maxThreshold.x ? max.x : abs.x) * sign.x,
			(abs.y < minThreshold.y ? min.y : abs.y > maxThreshold.y ? max.y : abs.y) * sign.y,
		])
	}

	tick() {
		this.tickVelocity()
		this.tickVelocityFriction()
		this.tickPosition()

		this.tickScaleVelocity()
		this.tickScale()
	}

	tickPosition() {
		const velocity = this.velocity.get()
		if (equals(velocity, [0, 0])) return
		const oldPosition = this.transform.position.get()
		const newPosition = add(oldPosition, velocity)
		this.transform.position.set(newPosition)
	}

	tickVelocity() {
		const acceleration = this.acceleration.get()
		if (equals(acceleration, [0, 0])) return
		const oldVelocity = this.velocity.get()
		const newVelocity = add(oldVelocity, acceleration)

		this.velocity.set(this.snapVelocity(newVelocity))
	}

	tickVelocityFriction() {
		const friction = this.friction.get()
		if (equals(friction, [1, 1])) return
		const oldVelocity = this.velocity.get()
		const newVelocity = c([oldVelocity.x * friction.x, oldVelocity.y * friction.y])
		this.velocity.set(this.snapVelocity(newVelocity))
	}

	/** @param {Vector2D} velocity */
	snapVelocity(velocity) {
		return Movement.snap(
			velocity,
			this.minVelocity.get(),
			this.maxVelocity.get(),
			this.minVelocityThreshold.get(),
			this.maxVelocityThreshold.get(),
		)
	}

	tickScale() {
		const scaleVelocity = this.scaleVelocity.get()
		if (equals(scaleVelocity, [0, 0])) return
		const oldScale = this.transform.scale.get()
		const newScale = c([oldScale.x * scaleVelocity.x, oldScale.y * scaleVelocity.y])
		this.transform.scale.set(newScale)
	}

	tickScaleVelocity() {
		const scaleAcceleration = this.scaleAcceleration.get()
		if (equals(scaleAcceleration, [0, 0])) return
		const oldScaleVelocity = this.scaleVelocity.get()
		const newScaleVelocity = c([
			oldScaleVelocity.x * scaleAcceleration.x,
			oldScaleVelocity.y * scaleAcceleration.y,
		])
		this.scaleVelocity.set(newScaleVelocity)
	}
}
