// @ts-nocheck
// This is a modified version of Habitat

//=============//
// FROGASAURUS //
//=============//
const HabitatFrogasaurus = {}
const document = window.document || {}
const requestAnimationFrame = window.requestAnimationFrame || ((v) => setTimeout(v, 0))

//========//
// SOURCE //
//========//
{
	//====== ./array.js ======
	{
		HabitatFrogasaurus["./array.js"] = {}
		const shuffleArray = (array) => {
			// Go backwards through the array
			for (let i = array.length - 1; i > 0; i--) {
				// Swap each value with a random value before it (which might include itself)
				const j = Math.floor(Math.random() * (i + 1))
				;[array[i], array[j]] = [array[j], array[i]]
			}
			return array
		}

		const trimArray = (array) => {
			// If the array is empty just return it
			if (array.length == 0) return array

			let start = array.length - 1
			let end = 0

			// Find the first non-undefined index
			for (let i = 0; i < array.length; i++) {
				const value = array[i]
				if (value !== undefined) {
					start = i
					break
				}
			}

			// Find the last non-undefined index
			for (let i = array.length - 1; i >= 0; i--) {
				const value = array[i]
				if (value !== undefined) {
					end = i + 1
					break
				}
			}

			// Cut off the start and end of the array
			array.splice(end)
			array.splice(0, start)
			return array
		}

		const repeatArray = (array, count) => {
			// If count is zero, empty the array
			if (count === 0) {
				array.splice(0)
				return array
			}

			// If count is less than zero, reverse the array
			else if (count < 0) {
				array.reverse()
				count = Math.abs(count)
			}

			// Otherwise repeat the array
			const clone = [...array]
			for (let i = 0; i < count - 1; i++) {
				array.push(...clone)
			}

			return array
		}

		HabitatFrogasaurus["./array.js"].shuffleArray = shuffleArray
		HabitatFrogasaurus["./array.js"].trimArray = trimArray
		HabitatFrogasaurus["./array.js"].repeatArray = repeatArray
	}

	//====== ./async.js ======
	{
		HabitatFrogasaurus["./async.js"] = {}
		const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

		HabitatFrogasaurus["./async.js"].sleep = sleep
	}

	//====== ./colour.js ======
	{
		HabitatFrogasaurus["./colour.js"] = {}

		//===========//
		// UTILITIES //
		//===========//
		const wrapSplashNumber = (number) => {
			while (number < 0) number += 1000
			while (number > 999) number -= 1000
			return number
		}

		const getThreeDigits = (number) => {
			const chars = number.toString().padStart(3, "0").split("")
			const digits = chars.map((v) => parseInt(v))
			return digits
		}

		//=========//
		// CLASSES //
		//=========//
		const Colour = class extends Array {
			constructor(red, green, blue, alpha = 255) {
				super()
				this.push(red, green, blue)
				if (alpha !== undefined) {
					this.push(alpha)
				}
			}

			toString() {
				const [red, green, blue, alpha] = this.map((v) => v.toString(16).padStart(2, "0"))
				if (this[3] === 255) {
					return `#${red}${green}${blue}`
				}

				return `#${red}${green}${blue}${alpha}`
			}
		}

		const Splash = class extends Colour {
			constructor(number) {
				const wrappedNumber = wrapSplashNumber(number)
				const [hundreds, tens, ones] = getThreeDigits(wrappedNumber)
				const red = RED_SPLASH_VALUES[hundreds]
				const green = GREEN_SPLASH_VALUES[tens]
				const blue = BLUE_SPLASH_VALUES[ones]
				super(red, green, blue)
				Reflect.defineProperty(this, "splash", { value: wrappedNumber, enumerable: false })
			}
		}

		//===========//
		// FUNCTIONS //
		//===========//
		const showColour = (colour) => {
			console.log("%c   ", `background-color: ${new Colour(...colour)}`)
		}

		//=========//
		// METHODS //
		//=========//
		const registerColourMethods = () => {
			defineAccessor(
				Array.prototype,
				"red",
				function () {
					return this[0]
				},
				function (value) {
					this[0] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"green",
				function () {
					return this[1]
				},
				function (value) {
					this[1] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"blue",
				function () {
					return this[2]
				},
				function (value) {
					this[2] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"alpha",
				function () {
					return this[3]
				},
				function (value) {
					this[3] = value
				},
			)
		}

		//===========//
		// CONSTANTS //
		//===========//
		const RED_SPLASH_VALUES = [23, 55, 70, 98, 128, 159, 174, 204, 242, 255]
		const GREEN_SPLASH_VALUES = [29, 67, 98, 128, 159, 174, 204, 222, 245, 255]
		const BLUE_SPLASH_VALUES = [40, 70, 98, 128, 159, 174, 204, 222, 247, 255]

		/** @type {Colour} */
		const VOID = new Colour(6, 7, 10)
		/** @type {Colour} */
		const BLACK = new Splash(0)
		/** @type {Colour} */
		const GREY = new Splash(112)
		/** @type {Colour} */
		const SILVER = new Splash(556)
		/** @type {Colour} */
		const WHITE = new Splash(999)

		/** @type {Colour} */
		const GREEN = new Splash(293)
		/** @type {Colour} */
		const CYAN = new Splash(269)
		/** @type {Colour} */
		const BLUE = new Splash(239)
		/** @type {Colour} */
		const PURPLE = new Splash(418)
		/** @type {Colour} */
		const PINK = new Splash(937)
		/** @type {Colour} */
		const CORAL = new Splash(933)
		/** @type {Colour} */
		const RED = new Splash(911)
		/** @type {Colour} */
		const ORANGE = new Splash(931)
		/** @type {Colour} */
		const YELLOW = new Splash(991)

		const HUES = [GREEN, CYAN, BLUE, PURPLE, PINK, CORAL, RED, ORANGE, YELLOW]

		const SHADES = [VOID, BLACK, GREY, SILVER, WHITE]

		const COLOURS = [...SHADES, ...HUES]

		HabitatFrogasaurus["./colour.js"].Colour = Colour
		HabitatFrogasaurus["./colour.js"].Splash = Splash
		HabitatFrogasaurus["./colour.js"].showColour = showColour
		HabitatFrogasaurus["./colour.js"].registerColourMethods = registerColourMethods
		HabitatFrogasaurus["./colour.js"].VOID = VOID
		HabitatFrogasaurus["./colour.js"].BLACK = BLACK
		HabitatFrogasaurus["./colour.js"].GREY = GREY
		HabitatFrogasaurus["./colour.js"].SILVER = SILVER
		HabitatFrogasaurus["./colour.js"].WHITE = WHITE
		HabitatFrogasaurus["./colour.js"].GREEN = GREEN
		HabitatFrogasaurus["./colour.js"].CYAN = CYAN
		HabitatFrogasaurus["./colour.js"].BLUE = BLUE
		HabitatFrogasaurus["./colour.js"].PURPLE = PURPLE
		HabitatFrogasaurus["./colour.js"].PINK = PINK
		HabitatFrogasaurus["./colour.js"].CORAL = CORAL
		HabitatFrogasaurus["./colour.js"].RED = RED
		HabitatFrogasaurus["./colour.js"].ORANGE = ORANGE
		HabitatFrogasaurus["./colour.js"].YELLOW = YELLOW
		HabitatFrogasaurus["./colour.js"].HUES = HUES
		HabitatFrogasaurus["./colour.js"].SHADES = SHADES
		HabitatFrogasaurus["./colour.js"].COLOURS = COLOURS
	}

	//====== ./component.js ======
	{
		HabitatFrogasaurus["./component.js"] = {}

		const Component = class {
			name = "component"
			constructor(entity) {
				this.entity = entity
			}
		}

		Component.Transform = class extends Component {
			name = "transform"
			position = use([0, 0])
			scale = use([1, 1])
			rotation = use(0)

			constructor(properties = {}) {
				super()
				Object.assign(this, properties)
				glue(this)
			}

			scaledPosition = snuse(() => {
				const { entity } = this
				const { parent } = entity
				if (!parent || !parent.transform) {
					return this.position
				}

				const [x, y] = this.position
				const [sx, sy] = this.absoluteScale
				return [x * sx, y * sy]
			})

			// TODO: make this support rotation
			getRelative(vector) {
				const [x, y] = vector
				const [sx, sy] = this.absoluteScale
				return [x / sx, y / sy]
			}

			absolutePosition = use(() => {
				const { entity } = this
				if (!entity) return this.position
				const { parent } = entity

				if (!parent || !parent.transform) {
					return this.position
				}

				const [x, y] = this.position
				const [sx, sy] = parent.transform.absoluteScale
				const scaledPosition = [x * sx, y * sy]

				const rotatedPosition = rotate(scaledPosition, parent.transform.absoluteRotation)
				return add(parent.transform.absolutePosition, rotatedPosition)
			})

			// TODO: make this support rotation
			setAbsolutePosition(absolutePosition) {
				const { entity } = this
				const { parent } = entity

				if (!parent || !parent.transform) {
					this.position = absolutePosition
					return
				}

				const [ax, ay] = absolutePosition
				const [pax, pay] = parent.transform.absolutePosition
				const [psx, psy] = parent.transform.absoluteScale
				const [x, y] = [(ax - pax) / psx, (ay - pay) / psy]

				this.position = [x, y]

				// this.absolutePosition
			}

			getRelativePosition(absolutePosition) {
				const positionedDisplacement = subtract(absolutePosition, this.absolutePosition)
				const rotatedDisplacement = rotate(positionedDisplacement, -this.absoluteRotation)
				const scaledDisplacement = [
					rotatedDisplacement.x / this.absoluteScale.x,
					rotatedDisplacement.y / this.absoluteScale.y,
				]

				return scaledDisplacement
			}

			absoluteScale = snuse(() => {
				const { entity } = this
				const { parent } = entity
				if (!parent || !parent.transform) {
					return this.scale
				}
				const [x, y] = this.scale
				const [px, py] = parent.transform.absoluteScale
				return [x * px, y * py]
			})

			absoluteRotation = snuse(() => {
				const { entity } = this
				const { parent } = entity
				if (!parent || !parent.transform) {
					return this.rotation
				}
				return this.rotation + parent.transform.absoluteRotation
			})
		}

		Component.Stage = class extends Component {
			constructor(stage) {
				super("stage")
				if (stage) {
					this.connect(stage)
				}
			}

			tick(context) {
				const { entity } = this
				entity.tick?.(context)
				for (const child of entity.children) {
					child.stage?.tick(context)
				}
			}

			update(context) {
				const { entity } = this
				entity.update?.(context)
				for (const child of entity.children) {
					child.stage?.update(context)
				}
			}

			start(context) {
				const { entity } = this
				entity.start?.(context)
				for (const child of entity.children) {
					child.stage?.start(context)
				}
			}

			resize(context) {
				const { entity } = this
				entity.resize?.(context)
				for (const child of entity.children) {
					child.stage?.resize(context)
				}
			}

			connect(stage) {
				stage.tick = this.tick.bind(this)
				stage.update = this.update.bind(this)
				stage.start = this.start.bind(this)
				stage.resize = this.resize.bind(this)
			}
		}

		Component.Rectangle = class extends Component {
			constructor(dimensions = [10, 10]) {
				super("rectangle")
				glue(this)
				this.dimensions = dimensions
			}

			dimensions = use([10, 10])
			scaledDimensions = snuse(() => {
				const [width, height] = this.dimensions
				const [scaleX, scaleY] = this.entity.transform.scale
				return [width * scaleX, height * scaleY]
			})

			absoluteDimensions = snuse(() => {
				const [width, height] = this.dimensions
				const [scaleX, scaleY] = this.entity.transform.absoluteScale
				return [width * scaleX, height * scaleY]
			})

			bounds = snuse(() => {
				const { entity } = this
				const [x, y] = entity.transform.position
				const [width, height] = this.dimensions
				return {
					left: x,
					right: x + width,
					top: y,
					bottom: y + height,
				}
			})

			scaledBounds = snuse(() => {
				const { entity } = this
				const [x, y] = entity.transform.position
				const [width, height] = this.scaledDimensions
				return {
					left: x,
					right: x + width,
					top: y,
					bottom: y + height,
				}
			})

			absoluteBounds = snuse(() => {
				const { entity } = this
				const [x, y] = entity.transform.absolutePosition
				const [width, height] = this.absoluteDimensions
				return {
					left: x,
					right: x + width,
					top: y,
					bottom: y + height,
				}
			})
		}

		HabitatFrogasaurus["./component.js"].Component = Component
	}

	//====== ./console.js ======
	{
		HabitatFrogasaurus["./console.js"] = {}

		const print = console.log.bind(console)

		let printCount = 0
		const print9 = (message) => {
			if (printCount > 9) return
			printCount++
			print(message)
		}

		const registerDebugMethods = () => {
			defineGetter(Object.prototype, "d", function () {
				const value = this.valueOf()
				print(value)
				return value
			})

			defineGetter(Object.prototype, "d9", function () {
				const value = this.valueOf()
				print9(value)
				return value
			})
		}

		HabitatFrogasaurus["./console.js"].print = print
		HabitatFrogasaurus["./console.js"].print9 = print9
		HabitatFrogasaurus["./console.js"].registerDebugMethods = registerDebugMethods
	}

	//====== ./document.js ======
	{
		HabitatFrogasaurus["./document.js"] = {}
		const $ = (...args) => document.querySelector(...args)
		const $$ = (...args) => document.querySelectorAll(...args)

		HabitatFrogasaurus["./document.js"].$ = $
		HabitatFrogasaurus["./document.js"].$$ = $$
	}

	//====== ./entity.js ======
	{
		// HabitatFrogasaurus["./entity.js"] = {}
		// HabitatFrogasaurus["./entity.js"].Entity = Entity
	}

	//====== ./event.js ======
	{
		HabitatFrogasaurus["./event.js"] = {}
		const fireEvent = (name, options = {}, type = Event) => {
			const { target = null, bubbles = true, cancelable = true, ...data } = options
			const event = new type(name, { bubbles, cancelable, ...options })
			for (const key in data) {
				if (event[key] !== undefined) continue
				event[key] = data[key]
			}
			if (target) {
				// It's non-writable, so we have to use Reflect.defineProperty
				Reflect.defineProperty(event, "target", { value: target, enumerable: true })
			}
			dispatchEvent(event)
		}

		const on = (event, func, options) => {
			return addEventListener(event, func, options)
		}

		HabitatFrogasaurus["./event.js"].fireEvent = fireEvent
		HabitatFrogasaurus["./event.js"].on = on
	}

	//====== ./habitat.js ======
	{
		HabitatFrogasaurus["./habitat.js"] = {}

		const registerMethods = () => {
			registerDebugMethods()
			registerColourMethods()
			registerVectorMethods()
		}

		const registerGlobals = () => {
			Object.assign(window, Habitat)
		}

		const registerEverything = () => {
			registerGlobals()
			registerMethods()
		}

		HabitatFrogasaurus["./habitat.js"].registerMethods = registerMethods
		HabitatFrogasaurus["./habitat.js"].registerGlobals = registerGlobals
		HabitatFrogasaurus["./habitat.js"].registerEverything = registerEverything
	}

	//====== ./html.js ======
	{
		HabitatFrogasaurus["./html.js"] = {}
		const HTML = (tag) => {
			return document.createElement(tag)
			// const template = document.createElement("template")
			// template.innerHTML = source
			// const { content } = template
			// if (content.childElementCount === 1) {
			// 	return content.firstChild
			// }
			// return template.content
		}

		HabitatFrogasaurus["./html.js"].HTML = HTML
	}

	//====== ./javascript.js ======
	{
		HabitatFrogasaurus["./javascript.js"] = {}
		const JavaScript = (source) => {
			const code = `return ${source}`
			const value = new Function(code)()
			return value
		}

		HabitatFrogasaurus["./javascript.js"].JavaScript = JavaScript
	}

	//====== ./json.js ======
	{
		HabitatFrogasaurus["./json.js"] = {}
		const _ = (value) => {
			return JSON.stringify(value)
		}

		HabitatFrogasaurus["./json.js"]._ = _
	}

	//====== ./keyboard.js ======
	{
		HabitatFrogasaurus["./keyboard.js"] = {}

		const keyboard = {}
		let isKeyboardTracked = false
		const getKeyboard = () => {
			if (isKeyboardTracked) return keyboard
			isKeyboardTracked = true
			on("keydown", (e) => {
				keyboard[e.key] = true
			})

			on("keyup", (e) => {
				keyboard[e.key] = false
			})

			return keyboard
		}

		let isKeyDownTracked = false
		const keyDown = (key) => {
			if (!isKeyDownTracked) {
				isKeyDownTracked = true
				on("keydown", (e) => fireEvent(`keyDown("${e.key}")`), { passive: false })
			}
			return `keyDown("${key}")`
		}

		let isKeyUpTracked = false
		const keyUp = (key) => {
			if (!isKeyUpTracked) {
				isKeyUpTracked = true
				on("keyup", (e) => fireEvent(`keyUp("${e.key}")`), { passive: false })
			}
			return `keyUp("${key}")`
		}

		HabitatFrogasaurus["./keyboard.js"].getKeyboard = getKeyboard
		HabitatFrogasaurus["./keyboard.js"].keyDown = keyDown
		HabitatFrogasaurus["./keyboard.js"].keyUp = keyUp
	}

	//====== ./lerp.js ======
	{
		HabitatFrogasaurus["./lerp.js"] = {}

		const lerp = ([a, b], distance) => {
			const range = subtract(b, a)
			const displacement = scale(range, distance)
			return add(a, displacement)
		}

		const bilerp = ([a, b, c, d], displacement) => {
			const [dx, dy] = displacement
			const la = lerp([a, b], dx)
			const lb = lerp([d, c], dx)
			return lerp([la, lb], dy)
		}

		// based on https://iquilezles.org/articles/ibilinear
		// adapted by Magnogen https://magnogen.net
		const ibilerp = ([a, b, c, d], value) => {
			if (typeof value === "number") {
				throw new Error(
					`[Habitat] Sorry, 'ibilerp' doesn't support numbers yet - only vectors... Please contact @todepond :)`,
				)
			}

			const e = subtract(b, a)
			const f = subtract(d, a)
			const g = add(subtract(a, b), subtract(c, d))
			const h = subtract(value, a)

			const k2 = crossProduct(g, f)
			const k1 = crossProduct(e, f) + crossProduct(h, g)
			const k0 = crossProduct(h, e)

			if (Math.abs(k2) < 0.0001) {
				const x = (h[0] * k1 + f[0] * k0) / (e[0] * k1 - g[0] * k0)
				const y = -k0 / k1
				return [x, y]
			}

			let w = k1 * k1 - 4 * k0 * k2
			w = Math.sqrt(w)

			const ik2 = 0.5 / k2
			let v = (-k1 - w) * ik2
			let u = (h[0] - f[0] * v) / (e[0] + g[0] * v)

			if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
				v = (-k1 + w) * ik2
				u = (h[0] - f[0] * v) / (e[0] + g[0] * v)
			}

			return [u, v]
		}

		HabitatFrogasaurus["./lerp.js"].lerp = lerp
		HabitatFrogasaurus["./lerp.js"].bilerp = bilerp
		HabitatFrogasaurus["./lerp.js"].ibilerp = ibilerp
	}

	//====== ./linked-list.js ======
	{
		HabitatFrogasaurus["./linked-list.js"] = {}
		const LinkedList = class {
			constructor(iterable = []) {
				this.start = undefined
				this.end = undefined
				this.isEmpty = true

				for (const value of iterable) {
					this.push(value)
				}
			}

			*[Symbol.iterator]() {
				let link = this.start
				while (link !== undefined) {
					yield link.value
					link = link.next
				}
			}

			toString() {
				return [...this].toString()
			}

			push(...values) {
				for (const value of values) {
					const link = makeLink(value)
					if (this.isEmpty) {
						this.start = link
						this.end = link
						this.isEmpty = false
					} else {
						this.end.next = link
						link.previous = this.end
						this.end = link
					}
				}
			}

			pop() {
				if (this.isEmpty) {
					return undefined
				}

				const value = this.start.value
				if (this.start === this.end) {
					this.clear()
					return value
				}

				this.end = this.end.previous
				this.end.next = undefined
				return value
			}

			shift() {
				if (this.isEmpty) {
					return undefined
				}

				const value = this.start.value
				if (this.start === this.end) {
					this.clear()
					return value
				}

				this.start = this.start.next
				this.start.previous = undefined
				return value
			}

			clear() {
				this.start = undefined
				this.end = undefined
				this.isEmpty = true
			}

			setStart(link) {
				this.start = link
				link.previous = undefined
			}
		}

		const makeLink = (value) => {
			const previous = undefined
			const next = undefined
			const link = { value, previous, next }
			return link
		}

		HabitatFrogasaurus["./linked-list.js"].LinkedList = LinkedList
	}

	//====== ./memo.js ======
	{
		HabitatFrogasaurus["./memo.js"] = {}
		const memo = (func, getKey = JSON.stringify) => {
			const cache = new Map()
			return (...args) => {
				const key = getKey(args)
				if (cache.has(key)) {
					return cache.get(key)
				}

				const result = func(...args)
				cache.set(key, result)
				return result
			}
		}

		HabitatFrogasaurus["./memo.js"].memo = memo
	}

	//====== ./mouse.js ======
	{
		HabitatFrogasaurus["./mouse.js"] = {}

		let isMouseTracked = false
		const buttonNames = ["Left", "Middle", "Right", "Back", "Forward"]
		const mouse = {
			position: [undefined, undefined],
		}

		const getMouse = () => {
			if (isMouseTracked) return mouse
			isMouseTracked = true

			on("mousemove", (e) => {
				mouse.position[0] = e.clientX
				mouse.position[1] = e.clientY
			})

			on("mousedown", (e) => {
				mouse.position[0] = e.clientX
				mouse.position[1] = e.clientY
				const buttonName = buttonNames[e.button]
				mouse[buttonName] = true
			})

			on("mouseup", (e) => {
				mouse.position[0] = e.clientX
				mouse.position[1] = e.clientY
				const buttonName = buttonNames[e.button]
				mouse[buttonName] = false
			})

			return mouse
		}

		let isMouseDownTracked = false
		const mouseDown = (buttonName) => {
			const button = buttonNames.indexOf(buttonName)
			if (!isMouseDownTracked) {
				isMouseDownTracked = true
				on("mousedown", (e) => fireEvent(`mouseDown("${e.button}")`), { passive: false })
			}
			return `mouseDown("${button}")`
		}

		let isMouseUpTracked = false
		const mouseUp = (buttonName) => {
			const button = buttonNames.indexOf(buttonName)
			if (!isMouseUpTracked) {
				isMouseUpTracked = true
				on("mouseup", (e) => fireEvent(`mouseUp("${e.button}")`), { passive: false })
			}
			return `mouseUp("${button}")`
		}

		HabitatFrogasaurus["./mouse.js"].getMouse = getMouse
		HabitatFrogasaurus["./mouse.js"].mouseDown = mouseDown
		HabitatFrogasaurus["./mouse.js"].mouseUp = mouseUp
	}

	//====== ./number.js ======
	{
		HabitatFrogasaurus["./number.js"] = {}
		const clamp = (number, min, max) => {
			return Math.min(Math.max(number, min), max)
		}

		const wrap = (number, min, max) => {
			while (number < min) {
				number += max - min
			}
			while (number >= max) {
				number -= max - min
			}
			return number
		}

		const getDigits = (number) => {
			const chars = number.toString().split("")
			const digits = chars.map((v) => parseInt(v)).filter((v) => !isNaN(v))
			return digits
		}

		const gcd = (...numbers) => {
			const [head, ...tail] = numbers
			if (numbers.length === 1) return head
			if (numbers.length > 2) return gcd(head, gcd(...tail))

			let [a, b] = [head, ...tail]
			while (true) {
				if (b === 0) return a
				a = a % b
				if (a === 0) return b
				b = b % a
			}
		}

		const simplifyRatio = (...numbers) => {
			const divisor = gcd(...numbers)
			return numbers.map((n) => n / divisor)
		}

		const range = function* (start, end) {
			let i = start
			if (i <= end)
				do {
					yield i
					i++
				} while (i <= end)
			else
				while (i >= end) {
					yield i
					i--
				}
		}

		HabitatFrogasaurus["./number.js"].clamp = clamp
		HabitatFrogasaurus["./number.js"].wrap = wrap
		HabitatFrogasaurus["./number.js"].getDigits = getDigits
		HabitatFrogasaurus["./number.js"].gcd = gcd
		HabitatFrogasaurus["./number.js"].simplifyRatio = simplifyRatio
		HabitatFrogasaurus["./number.js"].range = range
	}

	//====== ./options.js ======
	{
		HabitatFrogasaurus["./options.js"] = {}
		const Options = class extends Function {
			constructor({ default: _default, isDefault, ...options }) {
				super("head", "tail", "return this.self.match(head, tail)")
				const self = this.bind(this)
				this.self = self
				self.options = options
				self.default = _default
				self.isDefault = isDefault
				return self
			}

			match(head, tail) {
				// If we don't have a default option, just use the first as an object
				// @ts-ignore
				if (this.default === undefined || this.isDefault === undefined) {
					return this.call(head)
				}

				// If the first argument doesn't match the default, use it as an object
				// @ts-ignore
				if (!this.isDefault(head)) {
					return this.call(head)
				}

				// Otherwise, use the first argument as the default option, and the second as an object
				return this.call({
					// @ts-ignore
					[this.default]: head,
					...tail,
				})
			}

			call(options = {}) {
				const result = {}
				// @ts-ignore
				for (const key in this.options) {
					const arg = options[key]
					// @ts-ignore
					const value = arg === undefined ? this.options[key]() : arg
					result[key] = value
				}

				for (const key in options) {
					// @ts-ignore
					if (this.options[key] === undefined) {
						result[key] = options[key]
					}
				}

				return result
			}
		}

		HabitatFrogasaurus["./options.js"].Options = Options
	}

	//====== ./pointer.js ======
	{
		HabitatFrogasaurus["./pointer.js"] = {}
		let isPointerTracked = false
		const pointer = {
			position: [undefined, undefined],
			down: undefined,
		}

		const getPointer = () => {
			if (isPointerTracked) return pointer
			isPointerTracked = true

			addEventListener("pointermove", (e) => {
				const [x, y] = [e.clientX, e.clientY]
				if (x === pointer.position[0] && y === pointer.position[1]) return
				pointer.position[0] = x
				pointer.position[1] = y
			})

			addEventListener("pointerdown", (e) => {
				pointer.down = true
				const [x, y] = [e.clientX, e.clientY]
				if (x === pointer.position[0] && y === pointer.position[1]) return
				pointer.position[0] = x
				pointer.position[1] = y
			})

			addEventListener("pointerup", (e) => {
				pointer.down = false
				const [x, y] = [e.clientX, e.clientY]
				if (x === pointer.position[0] && y === pointer.position[1]) return
				pointer.position[0] = x
				pointer.position[1] = y
			})

			return pointer
		}

		HabitatFrogasaurus["./pointer.js"].getPointer = getPointer
	}

	//====== ./property.js ======
	{
		HabitatFrogasaurus["./property.js"] = {}
		const defineGetter = (object, name, get) => {
			return Reflect.defineProperty(object, name, {
				get,
				set(value) {
					Reflect.defineProperty(this, name, {
						value,
						configurable: true,
						writable: true,
						enumerable: true,
					})
				},
				configurable: true,
				enumerable: false,
			})
		}

		const defineAccessor = (object, name, get, set) => {
			return Reflect.defineProperty(object, name, {
				get,
				set,
				configurable: true,
				enumerable: false,
			})
		}

		HabitatFrogasaurus["./property.js"].defineGetter = defineGetter
		HabitatFrogasaurus["./property.js"].defineAccessor = defineAccessor
	}

	//====== ./random.js ======
	{
		HabitatFrogasaurus["./random.js"] = {}
		const maxRandomNumberIndex = 2 ** 14
		const randomNumbersBuffer = new Uint32Array(maxRandomNumberIndex)
		let randomNumberIndex = Infinity

		const random = () => {
			if (randomNumberIndex >= maxRandomNumberIndex) {
				crypto.getRandomValues(randomNumbersBuffer)
				randomNumberIndex = 0
			}
			const result = randomNumbersBuffer[randomNumberIndex]
			randomNumberIndex++
			return result
		}

		const randomFrom = (array) => {
			const index = random() % array.length
			return array[index]
		}

		const randomBetween = (min, max) => {
			const range = max - min
			return (random() % range) + min
		}

		const oneIn = (times) => random() % times < 1
		const maybe = (chance) => oneIn(1 / chance)

		HabitatFrogasaurus["./random.js"].random = random
		HabitatFrogasaurus["./random.js"].randomFrom = randomFrom
		HabitatFrogasaurus["./random.js"].randomBetween = randomBetween
		HabitatFrogasaurus["./random.js"].oneIn = oneIn
		HabitatFrogasaurus["./random.js"].maybe = maybe
	}

	//====== ./signal.js ======
	{
		HabitatFrogasaurus["./signal.js"] = {}
		const shared = {
			clock: 0,
			active: null,
		}

		// The underlying signal class
		const Signal = class {
			constructor(value, options = {}) {
				const self = this

				// Defaults
				self._isSignal = true
				self.dynamic = false
				self.lazy = false
				self._birth = -Infinity
				self._children = new Set() //implicit children
				self.children = new Set() //explicit children
				self._parents = new Set() //implicit parents
				self.parents = new Set() //explicit parents
				self.explicit = options.parents !== undefined
				self._current = undefined
				self._previous = undefined
				self._evaluate = () => self._current

				// Apply user-provided options
				const { parents, ...rest } = options
				Object.assign(self, {
					dynamic: false,
					lazy: false,
					eq: (a, b) => a === b,
					...rest,
				})

				// Join with static parents
				if (parents) {
					for (const parent of parents) {
						// if (!parent) continue
						parent.children.add(self)
						self.parents.add(parent)
					}
				}

				// Initialise our value
				if (self.dynamic) {
					self._evaluate = value
				} else {
					self._current = value
				}

				// Initialise the signal if eager
				if (!self.lazy) {
					self.update()
				}

				return self
			}

			set(value) {
				// Don't bother doing anything if our value hasn't changed
				if (this.eq && this._current !== undefined) {
					if (this.eq(this._current, value)) {
						return
					}
				}

				// Update our value
				this._previous = this._current
				this._birth = shared.clock++
				this._current = value

				// Update our implicit children
				const children = [...this._children]
				for (const child of children) {
					child.update()
				}

				// Update our static children
				for (const child of this.children) {
					child.update()
				}
			}

			// Check if the signal is out-of-date
			_isDirty() {
				// Eager signals are never dirty
				if (!this.lazy) {
					return false
				}

				// If we don't have a value yet, we're dirty
				if (this._birth < 0) {
					return true
				}

				// If any of our parents are newer than us, we're dirty
				for (const parent of this._parents) {
					if (parent._birth > this._birth) {
						return true
					}
				}

				return false
			}

			get() {
				// If our value is out-of-date, update our value
				if (this._isDirty()) {
					this.update()
				}

				// If there's an active signal, adopt it as a child
				// because it's using us as a dependency
				const { active } = shared
				if (active !== null) {
					if (!this.dynamic) {
						active._parents.add(this)
					} else {
						for (const parent of this._parents) {
							active._parents.add(parent)
						}
					}
					if (active.dynamic && !active.lazy) {
						this._children.add(active)
					}
				}

				// Return our value
				return this._current
			}

			update() {
				// If we're not dynamic, just pointlessly update our value to what it already is
				// Note: This probably won't do anything
				// This is only really used for when you've set a custom eq function
				if (!this.dynamic) {
					this.set(this._current)
					return
				}

				const paused = shared.active

				// If we're implicit, we'll need to reset and figure out our new implicit parents
				// Because they might change after this!
				if (!this.explicit) {
					// Run away from our parents
					// because we might not need them this time
					// Note: Don't need to do this if we're lazy, because our parents don't need to know about us
					if (!this.lazy) {
						for (const parent of this._parents) {
							parent._children.delete(this)
						}
					}
					this._parents.clear()

					// Keep hold of the active signal
					// It's our turn! We're the active signal now!
					// but we need to give it back afterwards
					shared.active = this
				} else {
					shared.active = null
				}

				// Evaluate our function
				const value = this._evaluate()

				// Give the active signal back
				shared.active = paused

				// Update our value
				this.set(value)
			}

			dispose() {
				if (!this.explicit) {
					// Remove ourselves from our implicit parents
					const parents = [...this._parents]
					for (const parent of parents) {
						parent._children.delete(this)
					}
					this._parents.clear()
				} else {
					// Remove ourselves from our explicit parents
					for (const parent of this.parents) {
						parent.children.delete(this)
					}
					this.parents.clear()
				}

				// Remove ourselves from our implicit children
				const children = [...this._children]
				for (const child of children) {
					child._parents.delete(this)
				}
				this._children.clear()

				// Remove ourselves from our explicit children
				for (const child of this.children) {
					child.parents.delete(this)
				}
				this.children.clear()
			}

			// glueTo(object, key) {
			// 	if (this.store) {
			// 		Reflect.defineProperty(object, key, {
			// 			get: () => this,
			// 			set: (value) => this.set(value),
			// 			enumerable: true,
			// 			configurable: true,
			// 		})
			// 		return
			// 	}

			// 	Reflect.defineProperty(object, key, {
			// 		get: () => this.get(),
			// 		set: (value) => this.set(value),
			// 		enumerable: true,
			// 		configurable: true,
			// 	})
			// }

			// get value() {
			// 	return this.get()
			// }

			// set value(value) {
			// 	this.set(value)
			// }

			// *[Symbol.iterator]() {
			// 	if (this.store) {
			// 		if (Array.isArray(this._current)) {
			// 			for (const [key] of this._properties) {
			// 				yield this[key]
			// 			}
			// 		} else {
			// 			for (const [key] of this._properties) {
			// 				yield [key, this[key]]
			// 			}
			// 		}
			// 		return
			// 	}

			// 	yield this
			// 	yield (value) => this.set(value)
			// }

			// [Symbol.toPrimitive](hint) {
			// 	if (hint === "string") {
			// 		return this.get().toString()
			// 	}
			// 	return this.get()
			// }

			// valueOf() {
			// 	return this.get()
			// }

			// toString() {
			// 	return this.get().toString()
			// }
		}

		// const ArrayView = class extends Array {
		// 	constructor(signal) {
		// 		if (typeof signal === "number") {
		// 			return new Array(signal)
		// 		}
		// 		super()
		// 		Reflect.defineProperty(this, "_isSignal", { value: true })
		// 		Reflect.defineProperty(this, "_signal", { value: signal })
		// 		for (const [key, property] of signal._properties) {
		// 			Reflect.defineProperty(this, key, {
		// 				get: () => property.get(),
		// 				set: (value) => property.set(value),
		// 			})
		// 		}
		// 	}

		// 	dispose() {
		// 		this._signal.dispose()
		// 	}

		// 	set(value) {
		// 		this._signal.set(value)
		// 	}

		// 	get() {
		// 		return this._signal.get()
		// 	}

		// 	update() {
		// 		this._signal.update()
		// 	}

		// 	get value() {
		// 		return this._signal.get()
		// 	}

		// 	set value(value) {
		// 		this._signal.value = value
		// 	}

		// 	// glueTo(object, key) {
		// 	// 	Reflect.defineProperty(object, key, {
		// 	// 		get: () => this,
		// 	// 		set: (value) => this.set(value),
		// 	// 		enumerable: true,
		// 	// 		configurable: true,
		// 	// 	})
		// 	// 	return
		// 	// }
		// }

		const use = (value, options = {}) => {
			if (Array.isArray(options)) {
				options = { parents: options }
			}

			const properties = {
				dynamic: typeof value === "function",
				lazy: false,
				// store: Array.isArray(value) || value?.constructor === Object,
				...options,
			}

			const signal = new Signal(value, properties)
			// if (Array.isArray(value) && properties.store) {
			// 	return new ArrayView(signal)
			// }
			return signal
		}

		const snuse = (value, options = {}) => {
			return use(value, { lazy: true, ...options })
		}

		// const glue = (source, target = source) => {
		// 	for (const key in source) {
		// 		const value = source[key]
		// 		if (value?._isSignal) {
		// 			value.glueTo(target, key)
		// 		}
		// 	}
		// }

		// HabitatFrogasaurus["./signal.js"].ArrayView = ArrayView

		/**
		 * @template {any} T
		 * @param {T | (() => T)} template
		 * @param {any?} options
		 * @returns {Signal<T>}
		 */
		HabitatFrogasaurus["./signal.js"].use = use

		/**
		 * @template {any} T
		 * @param {T | (() => T)} template
		 * @param {any?} options
		 * @returns {Signal<T>}
		 */
		HabitatFrogasaurus["./signal.js"].snuse = snuse
		// HabitatFrogasaurus["./signal.js"].glue = glue
	}

	//====== ./stage.js ======
	{
		HabitatFrogasaurus["./stage.js"] = {}

		const Stage = class {
			static options = {
				default: "context",
				isDefault: (v) => Array.isArray(v) || typeof v === "string",
				context: () => "2d",
				speed: () => 1.0,
				paused: () => false,
				start: () => () => {},
				resize: () => () => {},
				tick: () => () => {},
				update: () => () => {},
			}

			constructor(head, tail) {
				const options = new Options(Stage.options)(head, tail)

				const layered = typeof options.context !== "string"
				const keyed = layered && !Array.isArray(options.context)

				const contextTypes = layered ? options.context : [options.context]
				const layers = keyed ? {} : []
				const contexts = keyed ? {} : []
				for (const key in contextTypes) {
					const type = contextTypes[key]
					const layer = new Layer(type)
					layers[key] = layer
					contexts[key] = layer.context
				}

				const context = layered ? contexts : contexts[0]

				const internal = {
					layered,
					keyed,
					layers,
					context,
					clock: 0.0,
				}

				Object.assign(this, {
					...options,
					...internal,
				})

				if (document.body === null) {
					addEventListener("load", () => {
						requestAnimationFrame(() => this.fireStart())
					})
				} else {
					requestAnimationFrame(() => this.fireStart())
				}
			}

			fireStart = () => {
				// document.body.style["background-color"] = BLACK
				document.body.style["margin"] = "0px"
				document.body.style["overflow"] = "hidden"

				for (const key in this.layers) {
					const layer = this.layers[key]
					layer.context = layer.start()
				}

				const contexts = this.keyed ? {} : []
				for (const key in this.layers) {
					const layer = this.layers[key]
					contexts[key] = layer.context
				}

				this.context = this.layered ? contexts : contexts[0]

				on("resize", () => this.fireResize())
				on(keyDown(" "), () => (this.paused = !this.paused))

				this.fireResize()
				this.start(this.context)
				this.fireTick()
			}

			fireResize = () => {
				for (const key in this.layers) {
					const layer = this.layers[key]
					layer.resize(layer.context)
				}

				this.resize(this.context)
			}

			fireTick = (time) => {
				this.clock += this.speed
				while (this.clock > 0) {
					if (!this.paused) this.update(this.context, time)
					this.tick(this.context, time)
					this.clock--
				}

				requestAnimationFrame((time) => this.fireTick(time))
			}
		}

		const LayerTemplate = class {
			start() {}
			resize() {}
		}

		const CanvasLayer = class extends LayerTemplate {
			start() {
				const canvas = document.createElement("canvas")
				canvas.style["position"] = "absolute"
				document.body.appendChild(canvas)
				return canvas.getContext("2d")
			}

			resize(context) {
				const { canvas } = context
				canvas.width = Math.round(innerWidth)
				canvas.height = Math.round(innerHeight)
				canvas.style["width"] = canvas.width
				canvas.style["height"] = canvas.height
			}
		}

		const HTMLLayer = class extends LayerTemplate {
			start() {
				const div = document.createElement("div")
				div.style["position"] = "absolute"
				div.style["top"] = "0px"
				div.style["left"] = "0px"
				div.style["width"] = "100%"
				div.style["height"] = "100%"
				document.body.appendChild(div)
				return div
			}
		}

		const SVGLayer = class extends LayerTemplate {
			start() {
				const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
				svg.style["position"] = "absolute"
				svg.style["top"] = "0px"
				svg.style["left"] = "0px"
				svg.style["width"] = "100%"
				svg.style["height"] = "100%"
				document.body.appendChild(svg)
				return svg
			}
		}

		const Layer = class {
			static types = {
				"2d": CanvasLayer,
				"html": HTMLLayer,
				"svg": SVGLayer,
			}

			constructor(type) {
				const Constructor = Layer.types[type]
				const layer = new Constructor()
				layer.type = type
				layer.context = null
				return layer
			}
		}

		HabitatFrogasaurus["./stage.js"].Stage = Stage
	}

	//====== ./state.js ======
	{
		HabitatFrogasaurus["./state.js"] = {}

		const State = class {
			fire(name, arg) {
				const method = this[name]
				if (method) {
					return method.apply(this, [arg])
				}
			}
		}

		const Machine = class {
			state = use(undefined)

			constructor(initial) {
				// glue(this)
				if (initial) {
					this.set(initial)
				}
			}

			set(state) {
				const previous = this.state.get()
				const next = state

				if (previous !== undefined) {
					const result = previous.fire("exit", { previous, next, state: previous })
					if (result !== undefined) {
						throw new Error("Cannot set state during exit")
					}
				}

				this.state.set(next)
				const enterResult = next.fire("enter", { previous, next, state: next })

				if (enterResult === null) {
					this.set(previous)
					return null
				} else if (enterResult instanceof State) {
					this.set(enterResult)
				}
			}

			// Fire a method, and resolve any state changes
			fire(name, event, previous) {
				const state = this.state.get()
				previous = previous ?? state

				if (state === undefined) {
					return
				}

				event.state = state
				event.previous = previous
				const result = state.fire(name, event)

				if (result instanceof State) {
					const setResult = this.set(result)
					if (setResult !== null) {
						return this.fire(name, event, state)
					}
				}

				return result
			}
		}

		HabitatFrogasaurus["./state.js"].State = State
		HabitatFrogasaurus["./state.js"].Machine = Machine
	}

	//====== ./string.js ======
	{
		HabitatFrogasaurus["./string.js"] = {}
		const divideString = (string, length) => {
			const regExp = RegExp(`[^]{1,${length}}`, "g")
			return string.match(regExp)
		}

		HabitatFrogasaurus["./string.js"].divideString = divideString
	}

	//====== ./struct.js ======
	{
		HabitatFrogasaurus["./struct.js"] = {}
	}

	//====== ./svg.js ======
	{
		HabitatFrogasaurus["./svg.js"] = {}
		const SVG = (tag, attributes = {}) => {
			const group = document.createElementNS("http://www.w3.org/2000/svg", tag)
			for (const [key, value] of Object.entries(attributes)) {
				group.setAttribute(key, value)
			}
			return group
		}

		HabitatFrogasaurus["./svg.js"].SVG = SVG
	}

	//====== ./touch.js ======
	{
		HabitatFrogasaurus["./touch.js"] = {}

		const touches = []

		let isTouchTracked = false
		const getTouches = () => {
			if (!isTouchTracked) {
				isTouchTracked = true

				on("touchstart", (e) => {
					for (const changedTouch of e.changedTouches) {
						const id = changedTouch.identifier
						if (touches[id] === undefined) {
							touches[id] = { position: [undefined, undefined] }
						}

						const touch = touches[id]
						touch.position[0] = changedTouch.clientX
						touch.position[1] = changedTouch.clientY
					}
				})

				on("touchmove", (e) => {
					for (const changedTouch of e.changedTouches) {
						const id = changedTouch.identifier
						const touch = touches[id]
						touch.position[0] = changedTouch.clientX
						touch.position[1] = changedTouch.clientY
					}
				})

				on("touchend", (e) => {
					for (const changedTouch of e.changedTouches) {
						const id = changedTouch.identifier
						touches[id] = undefined
					}
				})
			}

			return touches
		}

		HabitatFrogasaurus["./touch.js"].getTouches = getTouches
	}

	//====== ./tween.js ======
	{
		HabitatFrogasaurus["./tween.js"] = {}

		const tween = (object, key, options) => {
			const value = object[key]

			const {
				start = value,
				end = value,
				duration = 1000,
				easeIn = 0.0,
				easeOut = 0.0,
				ratio = 0.5,
			} = options

			const startTime = performance.now()
			const endTime = startTime + duration

			defineGetter(object, key, () => {
				const currentTime = performance.now()

				if (currentTime >= endTime) {
					Reflect.defineProperty(object, key, {
						value: end,
						writable: true,
						configurable: true,
						enumerable: true,
					})
					return end
				}

				const time = currentTime - startTime
				const interpolation = ease(time / duration, {
					easeIn,
					easeOut,
					ratio: 1 - ratio,
				})
				return lerp([start, end], interpolation)
			})
		}

		const ease = (t, { easeIn, easeOut, ratio }) => {
			const f = (t, slope) => t ** (1.0 + slope)
			return (
				f(t * ratio * 2, easeIn) /
				(f(t * ratio * 2, easeIn) + f((1 - t) * (1 - ratio) * 2, easeOut))
			)
		}

		HabitatFrogasaurus["./tween.js"].tween = tween
	}

	//====== ./vector.js ======
	{
		HabitatFrogasaurus["./vector.js"] = {}

		const equals = (a, b) => {
			if (typeof a === "number") return a === b
			if (a.length === 2) {
				const [ax, ay] = a
				const [bx, by] = b
				return ax === bx && ay === by
			} else {
				const [ax, ay, az] = a
				const [bx, by, bz] = b
				return ax === bx && ay === by && az === bz
			}
		}

		const scale = (value, scale) => {
			if (typeof value === "number") return value * scale
			return value.map((v) => v * scale)
		}

		const multiply = (a, b) => {
			if (typeof b === "number") return scale(a, b)
			if (typeof a === "number") return scale(b, a)
			throw new Error("Unimplemented because I can't decide what to do with vectors")
		}

		const add = (a, b) => {
			if (typeof a === "number") {
				return a + b
			}

			if (a.length === 2) {
				const [ax, ay] = a
				const [bx, by] = b
				const x = ax + bx
				const y = ay + by
				return [x, y]
			} else {
				const [ax, ay, az] = a
				const [bx, by, bz] = b
				const x = ax + bx
				const y = ay + by
				const z = az + bz
				return [x, y, z]
			}
		}

		const subtract = (a, b) => {
			if (typeof a === "number") {
				return a - b
			}

			if (a.length === 2) {
				const [ax, ay] = a
				const [bx, by] = b
				const x = ax - bx
				const y = ay - by
				return [x, y]
			} else {
				const [ax, ay, az] = a
				const [bx, by, bz] = b
				const x = ax - bx
				const y = ay - by
				const z = az - bz
				return [x, y, z]
			}
		}

		const crossProduct = (a, b) => {
			if (a.length === 2) {
				const [ax, ay] = a
				const [bx, by] = b
				return ax * by - ay * bx
			} else {
				const [ax, ay, az] = a
				const [bx, by, bz] = b
				return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx]
			}
		}

		const distanceBetween = (a, b) => {
			const displacement = subtract(a, b)
			if (typeof displacement === "number") {
				return Math.abs(displacement)
			}
			const [dx, dy, dz = 0] = displacement
			const distance = Math.hypot(dx, dy, dz)
			return distance
		}

		const angleBetween = (a, b) => {
			const displacement = subtract(a, b)
			if (typeof displacement === "number" || displacement.length !== 2) {
				throw new Error(
					"[Habitat] Sorry, only 2D vectors are supported at the moment. Please bug @todepond to support other lengths :)",
				)
			}
			const [dx, dy] = displacement
			const angle = Math.atan2(dy, dx)
			return angle
		}

		const rotate = (vector, angle, origin = [0, 0]) => {
			const displacement = subtract(vector, origin)
			if (typeof displacement === "number" || displacement.length !== 2) {
				throw new Error(
					"[Habitat] Sorry, only 2D vectors are supported at the moment. Please bug @todepond to support other lengths :)",
				)
			}
			const [dx, dy] = displacement
			const cos = Math.cos(angle)
			const sin = Math.sin(angle)
			const x = dx * cos - dy * sin
			const y = dx * sin + dy * cos
			const rotated = add([x, y], origin)
			return rotated
		}

		const normalise = (vector) => {
			const origin = vector.map(() => 0)
			const distance = distanceBetween(vector, origin)
			const normalised = scale(vector, 1 / distance)
			return normalised
		}

		const registerVectorMethods = () => {
			defineAccessor(
				Array.prototype,
				"x",
				function () {
					return this[0]
				},
				function (value) {
					this[0] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"y",
				function () {
					return this[1]
				},
				function (value) {
					this[1] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"z",
				function () {
					return this[2]
				},
				function (value) {
					this[2] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"width",
				function () {
					return this[0]
				},
				function (value) {
					this[0] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"height",
				function () {
					return this[1]
				},
				function (value) {
					this[1] = value
				},
			)

			defineAccessor(
				Array.prototype,
				"depth",
				function () {
					return this[2]
				},
				function (value) {
					this[2] = value
				},
			)
		}

		HabitatFrogasaurus["./vector.js"].equals = equals
		HabitatFrogasaurus["./vector.js"].scale = scale
		HabitatFrogasaurus["./vector.js"].multiply = multiply
		HabitatFrogasaurus["./vector.js"].add = add
		HabitatFrogasaurus["./vector.js"].subtract = subtract
		HabitatFrogasaurus["./vector.js"].crossProduct = crossProduct
		HabitatFrogasaurus["./vector.js"].distanceBetween = distanceBetween
		HabitatFrogasaurus["./vector.js"].angleBetween = angleBetween
		HabitatFrogasaurus["./vector.js"].rotate = rotate
		HabitatFrogasaurus["./vector.js"].normalise = normalise
		HabitatFrogasaurus["./vector.js"].registerVectorMethods = registerVectorMethods
	}

	const { defineAccessor, defineGetter } = HabitatFrogasaurus["./property.js"]
	const { Options } = HabitatFrogasaurus["./options.js"]
	const { glue, snuse, use } = HabitatFrogasaurus["./signal.js"]
	const { add, rotate, registerVectorMethods, crossProduct, scale, subtract } =
		HabitatFrogasaurus["./vector.js"]
	const { registerColourMethods, BLACK } = HabitatFrogasaurus["./colour.js"]
	const { registerDebugMethods } = HabitatFrogasaurus["./console.js"]
	const { fireEvent, on } = HabitatFrogasaurus["./event.js"]
	const { keyDown } = HabitatFrogasaurus["./keyboard.js"]
	const { lerp } = HabitatFrogasaurus["./lerp.js"]
}

//=========//
// EXPORTS //
//=========//
export const shuffleArray = HabitatFrogasaurus["./array.js"].shuffleArray
export const trimArray = HabitatFrogasaurus["./array.js"].trimArray
export const repeatArray = HabitatFrogasaurus["./array.js"].repeatArray
export const sleep = HabitatFrogasaurus["./async.js"].sleep
export const Colour = HabitatFrogasaurus["./colour.js"].Colour
export const Splash = HabitatFrogasaurus["./colour.js"].Splash
export const showColour = HabitatFrogasaurus["./colour.js"].showColour
export const registerColourMethods = HabitatFrogasaurus["./colour.js"].registerColourMethods
/** @type {Colour} */
export const VOID = HabitatFrogasaurus["./colour.js"].VOID
/** @type {Colour} */
export const BLACK = HabitatFrogasaurus["./colour.js"].BLACK
/** @type {Colour} */
export const GREY = HabitatFrogasaurus["./colour.js"].GREY
/** @type {Colour} */
export const SILVER = HabitatFrogasaurus["./colour.js"].SILVER
/** @type {Colour} */
export const WHITE = HabitatFrogasaurus["./colour.js"].WHITE
/** @type {Colour} */
export const GREEN = HabitatFrogasaurus["./colour.js"].GREEN
/** @type {Colour} */
export const CYAN = HabitatFrogasaurus["./colour.js"].CYAN
/** @type {Colour} */
export const BLUE = HabitatFrogasaurus["./colour.js"].BLUE
/** @type {Colour} */
export const PURPLE = HabitatFrogasaurus["./colour.js"].PURPLE
/** @type {Colour} */
export const PINK = HabitatFrogasaurus["./colour.js"].PINK
/** @type {Colour} */
export const CORAL = HabitatFrogasaurus["./colour.js"].CORAL
/** @type {Colour} */
export const RED = HabitatFrogasaurus["./colour.js"].RED
/** @type {Colour} */
export const ORANGE = HabitatFrogasaurus["./colour.js"].ORANGE
/** @type {Colour} */
export const YELLOW = HabitatFrogasaurus["./colour.js"].YELLOW
/** @type {Colour[]} */
export const HUES = HabitatFrogasaurus["./colour.js"].HUES
/** @type {Colour[]} */
export const SHADES = HabitatFrogasaurus["./colour.js"].SHADES
/** @type {Colour[]} */
export const COLOURS = HabitatFrogasaurus["./colour.js"].COLOURS
// export const Component = HabitatFrogasaurus["./component.js"].Component
export const print = HabitatFrogasaurus["./console.js"].print
export const print9 = HabitatFrogasaurus["./console.js"].print9
export const registerDebugMethods = HabitatFrogasaurus["./console.js"].registerDebugMethods
export const $ = HabitatFrogasaurus["./document.js"].$
export const $$ = HabitatFrogasaurus["./document.js"].$$
// export const Entity = HabitatFrogasaurus["./entity.js"].Entity
export const fireEvent = HabitatFrogasaurus["./event.js"].fireEvent
export const on = HabitatFrogasaurus["./event.js"].on
export const registerMethods = HabitatFrogasaurus["./habitat.js"].registerMethods
export const registerGlobals = HabitatFrogasaurus["./habitat.js"].registerGlobals
export const registerEverything = HabitatFrogasaurus["./habitat.js"].registerEverything
export const HTML = HabitatFrogasaurus["./html.js"].HTML
export const JavaScript = HabitatFrogasaurus["./javascript.js"].JavaScript
export const _ = HabitatFrogasaurus["./json.js"]._
export const getKeyboard = HabitatFrogasaurus["./keyboard.js"].getKeyboard
export const keyDown = HabitatFrogasaurus["./keyboard.js"].keyDown
export const keyUp = HabitatFrogasaurus["./keyboard.js"].keyUp
export const lerp = HabitatFrogasaurus["./lerp.js"].lerp
export const bilerp = HabitatFrogasaurus["./lerp.js"].bilerp
export const ibilerp = HabitatFrogasaurus["./lerp.js"].ibilerp
export const LinkedList = HabitatFrogasaurus["./linked-list.js"].LinkedList
export const memo = HabitatFrogasaurus["./memo.js"].memo
export const getMouse = HabitatFrogasaurus["./mouse.js"].getMouse
export const mouseDown = HabitatFrogasaurus["./mouse.js"].mouseDown
export const mouseUp = HabitatFrogasaurus["./mouse.js"].mouseUp
export const clamp = HabitatFrogasaurus["./number.js"].clamp
export const wrap = HabitatFrogasaurus["./number.js"].wrap
export const getDigits = HabitatFrogasaurus["./number.js"].getDigits
export const gcd = HabitatFrogasaurus["./number.js"].gcd
export const simplifyRatio = HabitatFrogasaurus["./number.js"].simplifyRatio
export const range = HabitatFrogasaurus["./number.js"].range
export const Options = HabitatFrogasaurus["./options.js"].Options
export const getPointer = HabitatFrogasaurus["./pointer.js"].getPointer
export const defineGetter = HabitatFrogasaurus["./property.js"].defineGetter
export const defineAccessor = HabitatFrogasaurus["./property.js"].defineAccessor
export const random = HabitatFrogasaurus["./random.js"].random
export const randomFrom = HabitatFrogasaurus["./random.js"].randomFrom
export const randomBetween = HabitatFrogasaurus["./random.js"].randomBetween
export const oneIn = HabitatFrogasaurus["./random.js"].oneIn
export const maybe = HabitatFrogasaurus["./random.js"].maybe
export const ArrayView = HabitatFrogasaurus["./signal.js"].ArrayView

export const use = HabitatFrogasaurus["./signal.js"].use
export const snuse = HabitatFrogasaurus["./signal.js"].snuse
export const glue = HabitatFrogasaurus["./signal.js"].glue
export const Stage = HabitatFrogasaurus["./stage.js"].Stage
export const State = HabitatFrogasaurus["./state.js"].State
export const Machine = HabitatFrogasaurus["./state.js"].Machine
export const divideString = HabitatFrogasaurus["./string.js"].divideString
export const SVG = HabitatFrogasaurus["./svg.js"].SVG
export const getTouches = HabitatFrogasaurus["./touch.js"].getTouches
export const tween = HabitatFrogasaurus["./tween.js"].tween
export const equals = HabitatFrogasaurus["./vector.js"].equals
export const scale = HabitatFrogasaurus["./vector.js"].scale
export const multiply = HabitatFrogasaurus["./vector.js"].multiply
export const add = HabitatFrogasaurus["./vector.js"].add
export const subtract = HabitatFrogasaurus["./vector.js"].subtract
export const crossProduct = HabitatFrogasaurus["./vector.js"].crossProduct
export const distanceBetween = HabitatFrogasaurus["./vector.js"].distanceBetween
export const angleBetween = HabitatFrogasaurus["./vector.js"].angleBetween
export const rotate = HabitatFrogasaurus["./vector.js"].rotate
export const normalise = HabitatFrogasaurus["./vector.js"].normalise
export const registerVectorMethods = HabitatFrogasaurus["./vector.js"].registerVectorMethods

export const Habitat = {
	shuffleArray: HabitatFrogasaurus["./array.js"].shuffleArray,
	trimArray: HabitatFrogasaurus["./array.js"].trimArray,
	repeatArray: HabitatFrogasaurus["./array.js"].repeatArray,
	sleep: HabitatFrogasaurus["./async.js"].sleep,
	Colour: HabitatFrogasaurus["./colour.js"].Colour,
	Splash: HabitatFrogasaurus["./colour.js"].Splash,
	showColour: HabitatFrogasaurus["./colour.js"].showColour,
	registerColourMethods: HabitatFrogasaurus["./colour.js"].registerColourMethods,
	VOID: HabitatFrogasaurus["./colour.js"].VOID,
	BLACK: HabitatFrogasaurus["./colour.js"].BLACK,
	GREY: HabitatFrogasaurus["./colour.js"].GREY,
	SILVER: HabitatFrogasaurus["./colour.js"].SILVER,
	WHITE: HabitatFrogasaurus["./colour.js"].WHITE,
	GREEN: HabitatFrogasaurus["./colour.js"].GREEN,
	CYAN: HabitatFrogasaurus["./colour.js"].CYAN,
	BLUE: HabitatFrogasaurus["./colour.js"].BLUE,
	PURPLE: HabitatFrogasaurus["./colour.js"].PURPLE,
	PINK: HabitatFrogasaurus["./colour.js"].PINK,
	CORAL: HabitatFrogasaurus["./colour.js"].CORAL,
	RED: HabitatFrogasaurus["./colour.js"].RED,
	ORANGE: HabitatFrogasaurus["./colour.js"].ORANGE,
	YELLOW: HabitatFrogasaurus["./colour.js"].YELLOW,
	HUES: HabitatFrogasaurus["./colour.js"].HUES,
	SHADES: HabitatFrogasaurus["./colour.js"].SHADES,
	COLOURS: HabitatFrogasaurus["./colour.js"].COLOURS,
	// Component: HabitatFrogasaurus["./component.js"].Component,
	print: HabitatFrogasaurus["./console.js"].print,
	print9: HabitatFrogasaurus["./console.js"].print9,
	registerDebugMethods: HabitatFrogasaurus["./console.js"].registerDebugMethods,
	$: HabitatFrogasaurus["./document.js"].$,
	$$: HabitatFrogasaurus["./document.js"].$$,
	// Entity: HabitatFrogasaurus["./entity.js"].Entity,
	fireEvent: HabitatFrogasaurus["./event.js"].fireEvent,
	on: HabitatFrogasaurus["./event.js"].on,
	registerMethods: HabitatFrogasaurus["./habitat.js"].registerMethods,
	registerGlobals: HabitatFrogasaurus["./habitat.js"].registerGlobals,
	registerEverything: HabitatFrogasaurus["./habitat.js"].registerEverything,
	HTML: HabitatFrogasaurus["./html.js"].HTML,
	JavaScript: HabitatFrogasaurus["./javascript.js"].JavaScript,
	_: HabitatFrogasaurus["./json.js"]._,
	getKeyboard: HabitatFrogasaurus["./keyboard.js"].getKeyboard,
	keyDown: HabitatFrogasaurus["./keyboard.js"].keyDown,
	keyUp: HabitatFrogasaurus["./keyboard.js"].keyUp,
	lerp: HabitatFrogasaurus["./lerp.js"].lerp,
	bilerp: HabitatFrogasaurus["./lerp.js"].bilerp,
	ibilerp: HabitatFrogasaurus["./lerp.js"].ibilerp,
	LinkedList: HabitatFrogasaurus["./linked-list.js"].LinkedList,
	memo: HabitatFrogasaurus["./memo.js"].memo,
	getMouse: HabitatFrogasaurus["./mouse.js"].getMouse,
	mouseDown: HabitatFrogasaurus["./mouse.js"].mouseDown,
	mouseUp: HabitatFrogasaurus["./mouse.js"].mouseUp,
	clamp: HabitatFrogasaurus["./number.js"].clamp,
	wrap: HabitatFrogasaurus["./number.js"].wrap,
	getDigits: HabitatFrogasaurus["./number.js"].getDigits,
	gcd: HabitatFrogasaurus["./number.js"].gcd,
	simplifyRatio: HabitatFrogasaurus["./number.js"].simplifyRatio,
	range: HabitatFrogasaurus["./number.js"].range,
	Options: HabitatFrogasaurus["./options.js"].Options,
	getPointer: HabitatFrogasaurus["./pointer.js"].getPointer,
	defineGetter: HabitatFrogasaurus["./property.js"].defineGetter,
	defineAccessor: HabitatFrogasaurus["./property.js"].defineAccessor,
	random: HabitatFrogasaurus["./random.js"].random,
	randomFrom: HabitatFrogasaurus["./random.js"].randomFrom,
	randomBetween: HabitatFrogasaurus["./random.js"].randomBetween,
	oneIn: HabitatFrogasaurus["./random.js"].oneIn,
	maybe: HabitatFrogasaurus["./random.js"].maybe,
	ArrayView: HabitatFrogasaurus["./signal.js"].ArrayView,
	use: HabitatFrogasaurus["./signal.js"].use,
	snuse: HabitatFrogasaurus["./signal.js"].snuse,
	glue: HabitatFrogasaurus["./signal.js"].glue,
	Stage: HabitatFrogasaurus["./stage.js"].Stage,
	State: HabitatFrogasaurus["./state.js"].State,
	Machine: HabitatFrogasaurus["./state.js"].Machine,
	divideString: HabitatFrogasaurus["./string.js"].divideString,
	SVG: HabitatFrogasaurus["./svg.js"].SVG,
	getTouches: HabitatFrogasaurus["./touch.js"].getTouches,
	tween: HabitatFrogasaurus["./tween.js"].tween,
	equals: HabitatFrogasaurus["./vector.js"].equals,
	scale: HabitatFrogasaurus["./vector.js"].scale,
	multiply: HabitatFrogasaurus["./vector.js"].multiply,
	add: HabitatFrogasaurus["./vector.js"].add,
	subtract: HabitatFrogasaurus["./vector.js"].subtract,
	crossProduct: HabitatFrogasaurus["./vector.js"].crossProduct,
	distanceBetween: HabitatFrogasaurus["./vector.js"].distanceBetween,
	angleBetween: HabitatFrogasaurus["./vector.js"].angleBetween,
	rotate: HabitatFrogasaurus["./vector.js"].rotate,
	normalise: HabitatFrogasaurus["./vector.js"].normalise,
	registerVectorMethods: HabitatFrogasaurus["./vector.js"].registerVectorMethods,
}
