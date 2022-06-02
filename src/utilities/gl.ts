export default class GlUtilities {

	private static _canvas: HTMLCanvasElement
	private static _context: WebGLRenderingContext

    public static get canvas():HTMLCanvasElement {
		if (!GlUtilities._canvas) {
			GlUtilities.initialize()
		}
        return GlUtilities._canvas
    }

    public static get context():WebGLRenderingContext {
		if (!GlUtilities._context) {
			GlUtilities.initialize()
		}
        return GlUtilities._context
    }

	private static initialize():void {
		const canvas = document.querySelector('canvas')
		const gl = canvas?.getContext('webgl')

		if (canvas) {
			GlUtilities._canvas = canvas
		}  else {
			throw new Error('Your browser does not support canvas')
		}

		if (gl) {
			GlUtilities._context = gl
		} else {
			throw new Error('Your browser does not support webgl')
		}

		this.resize()
	}

	private static resize():void {
		const resizeObserver = new ResizeObserver(this.resizeCallback)

		try {
			resizeObserver.observe(GlUtilities._canvas, {box: 'device-pixel-content-box'})
		} catch (err) {
			resizeObserver.observe(GlUtilities._canvas, {box: 'content-box'})
		}
	}

	private static resizeCallback(entries:ResizeObserverEntry[]):void {
		for (const entry of entries) {
			let width;
			let height;
			let dpr = window.devicePixelRatio

			if (entry.devicePixelContentBoxSize) {
				// width/height에 dpr 값 포함
				width = entry.devicePixelContentBoxSize[0].inlineSize
				height = entry.devicePixelContentBoxSize[0].blockSize
				dpr = 1
			} else if (entry.contentBoxSize) {
			
					width = entry.contentBoxSize[0].inlineSize
					height = entry.contentBoxSize[1].blockSize
		
			} else {
				width = entry.contentRect.width
				height = entry.contentRect.height
			}

			const displayWidth = Math.round(width * dpr)
			const displayHeight = Math.round(height * dpr)

			GlUtilities._context.canvas.width = displayWidth
			GlUtilities._context.canvas.height = displayHeight
		}
	}
}
