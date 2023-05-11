import { useEffect, useRef, useState } from "react"

export default function SnakeGame({ nRows = 30, width = 800, startLength = 10, onGameOver = null }) {

	const [ snake, setSnake] = useState(() => (
		Array(startLength > nRows / 2 ? Math.floor(nRows/2) : startLength)
		.fill(1).map((i, idx) => ({
			x: Math.round(nRows / 2) - idx, 
			y: Math.round(nRows / 2)
		})))
	)

	const [ speed, setSpeed ] = useState(250)
	const incSpeed = useRef(true)
	const score = useRef(0)
	const gameOver = useRef(false)
	const interval = useRef()
	const keyEvent = useRef()
	const clickEvent = useRef()
	const div = useRef()
	const headxy = useRef(snake[0])
	const dir = useRef({x: 1, y: 0})
	const apple = useRef({
		x: Math.floor(Math.random() * nRows),
		y: Math.floor(Math.random() * nRows)
	})

	const GridStyle = useRef({
			width: `${width}px`,
			height: `${width}px`,
			gridTemplateColumns: `repeat(${nRows}, ${width/nRows}px)`,
			gridTemplateRows: `repeat(${nRows}, ${width/nRows}px)`,
		})

	const grid = useRef(Array(nRows*nRows).fill(null)
		.map((item, idx) => ({
				x: idx%nRows,
				y: Math.floor(idx / nRows),
				isSnake: false
			})
		))

	function checkGrid() {
		grid.current.forEach(item => {
			item.isSnake =  false
			item.isApple = false
		})
		snake.forEach(item => 
			grid.current.at(item.x + item.y * nRows).isSnake = true)
		grid.current.at(apple.current.x + apple.current.y * nRows).isApple = true
	}

	function checkApple() {
		let head = snake[0]
		if (JSON.stringify(apple.current) === JSON.stringify(head)) {
			score.current ++
			incSpeed.current = true
			apple.current = {
				x: Math.floor(Math.random() * nRows), 
				y: Math.floor(Math.random() * nRows)
			}
		}
	}

	function checkBoundaries() {
		let head = snake[0]
		if (head.x > nRows - 1 || head.x < 0 
			|| head.y > nRows - 1 || head.y < 0) {
			gameOver.current = true
			clearInterval(interval.current)
			removeEventListener("click", clickEvent.current)
			removeEventListener("keydown", keyEvent.current)
		}		
	}

	function checkOver() {
		let head = snake[0]
		let over = snake.find((item, idx) => (idx !== 0 
				&& item.x === head.x && item.y === head.y))
		if (over) {
			gameOver.current = true
			clearInterval(interval.current)	
			removeEventListener("click", clickEvent.current)
			removeEventListener("keydown", keyEvent.current)				
		}
	}

	function checkSpeed() {
		if (score.current > 0 && score.current % 2 === 0 
			&& speed >= 80 && incSpeed.current) {
			incSpeed.current = false
			clearInterval(interval.current)	
			removeEventListener("click", clickEvent.current)
			removeEventListener("keydown", keyEvent.current)			
			setSpeed(prevState => prevState - 40)
		}
	}

	useEffect(() => {

		interval.current = setInterval(() => {
			setSnake(prevState => {
				let { x, y } = dir.current
				let newState = prevState.slice(0)
				newState.unshift({x: prevState[0].x + x, y: prevState[0].y + y})
				let head = newState[0]
				if (JSON.stringify(apple.current) !== JSON.stringify(head)) {
					newState.pop()
				}

				headxy.current = newState[0]
				return newState
			})
			
		}, speed)

		keyEvent.current = (e) => {
			e.preventDefault()
			let dx = 0; let dy = 0
			if (e.key === "ArrowLeft") dx = -1
			if (e.key === "ArrowRight") dx = 1
			if (e.key === "ArrowUp")  dy = -1
			if (e.key === "ArrowDown")  dy = 1
			dir.current = {x: dx, y: dy}
		}

		clickEvent.current = (e) => {
			if (!div.current.contains(e.target)) return
			let w = width / nRows
			let top = div.current.offsetTop
			let lef = div.current.offsetLeft
			let yh = top + w * headxy.current.y
			let xh = lef + w * headxy.current.x
			let dy = e.clientY > yh?1:-1
			let dx = e.clientX > xh?1:-1
			if (dir.current.y===0) {
				dir.current = {x: 0, y: dy}
			} else {
				dir.current = {x: dx, y: 0}
			}
		}

		addEventListener("keydown", keyEvent.current)
		addEventListener("click", clickEvent.current)

		return (() => {
			clearInterval(interval.current)
			removeEventListener("click", clickEvent.current)
			removeEventListener("keydown", keyEvent.current)
		})
	}, [speed])

	checkApple()
	checkBoundaries()
	checkOver()
	if (gameOver.current) onGameOver(score.current)
	if (!gameOver.current) checkSpeed()
	if (!gameOver.current) checkGrid()

	return (
		<div ref={div} className="snake-grid" style={GridStyle.current} >
			{grid.current.map((item, idx) => (
				<div 
					className={`${item.isSnake ? "snake" : ""}  
								${item.isApple ? "apple" : ""} 
								${item.x === snake[0].x && item.y === snake[0].y ? "head" : ""}`} 
					key={idx}>
				</div>
				)
			)}
		</div>
	)
}