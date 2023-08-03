import { c } from "./nogan.js"

/** @type {Behaviour} */
const override = ({ previous, next }) => {
	return next
}

/** @type {Behaviour} */
const pong = ({ previous, next }) => {
	const operation = c({
		type: "pong",
		message: "pong",
	})
	return {
		...next,
		operations: [operation],
	}
}

/** @type {Record<PulseType, Behaviour>} */
export const BEHAVIOURS = {
	raw: override,
	creation: override,
	destruction: override,
	ping: pong,
}
