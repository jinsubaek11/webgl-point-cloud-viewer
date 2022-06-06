import Vector2 from "../math/vector2"


interface Angles {
    horizontal: number
    vertical: number
}

export default class EventListener {
    private _zoom: number
	private _mouse: Vector2
	private _prev: Vector2
	private _startMousePos: Vector2
	private _endMousePos: Vector2
    private _angles: Angles
	private _oldAngles: Angles
    
    public constructor() {
        this._mouse = new Vector2()
		this._prev = new Vector2()
		this._startMousePos = new Vector2()
		this._endMousePos = new Vector2()
		this._zoom = 2
		this._angles = {
			horizontal: 0,
			vertical: 0,
		}
		this._oldAngles = {
			horizontal: 0,
			vertical: 0,
		}
    }

    public get angles():Angles {
        return this._angles
    }

    public get zoom():number {
        return this._zoom
    }

    public bind():void {
            let isMouseDown = false
            const EPS = 0.1
            
            window.addEventListener('wheel', (e:WheelEvent) => {
                this._zoom -= e.deltaY * 0.005

                if (this._zoom <= 0.1) this._zoom = EPS;
            })
            window.addEventListener('mousedown', (e:MouseEvent) => {
                isMouseDown = true
    
                this._startMousePos.x = e.clientX
                this._startMousePos.y = e.clientY
    
                this._oldAngles = {
                    vertical: this._angles.vertical * 1,
                    horizontal: this._angles.horizontal * 1
                }
            })
            window.addEventListener('mouseup', () => {
                isMouseDown = false
    
                this._startMousePos.x = 0
                this._startMousePos.y = 0
    
                this._endMousePos.x = 0
                this._endMousePos.y = 0
    
                this._oldAngles.horizontal = 0
                this._oldAngles.vertical = 0
            })
            window.addEventListener('mousemove', (e:MouseEvent) => {
                if (!isMouseDown) return
    
                this._endMousePos.x = e.clientX
                this._endMousePos.y = e.clientY
    
                const mouse =  this._endMousePos.subtract(this._startMousePos)
    
                this._angles.horizontal = this._oldAngles.horizontal - mouse.x/2
                
                if (this._angles.horizontal >= 180) this._angles.horizontal = 180
                if (this._angles.horizontal <= -180) this._angles.horizontal = -180
                
                this._angles.vertical = this._oldAngles.vertical - mouse.y/2
    
                if (this._angles.vertical >= 85) this._angles.vertical = 85
                if (this._angles.vertical <= -85) this._angles.vertical = -85
            })

    }

    
}