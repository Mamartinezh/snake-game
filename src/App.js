
import { useEffect, useRef, useState } from "react"
import SnakeGame from "./components/SnakeGame"
import ThemeSwitcher from "./components/ThemeSwitcher"

const initConf = {
	width: 600,
	nRows: 30,
	startLenght: 10	
}

export default function App() {

	const [ gameOver, setGameOver ] = useState(false)
	const [ score, setScore ] = useState(0)
	const [ snakeConf, setSnakeConf ] = useState(initConf)

	useEffect(()=>{
		onResize(false)
		addEventListener('resize', onResize)
		return ()=>removeEventListener('resize', onResize)
	}, [])

	function onResize(over=true) {
		if (window.innerWidth<=600) {
			setSnakeConf({
				width: 300,
				nRows: 15,
				startLenght: 5				
			})
		} else setSnakeConf(initConf)
		if (over) setGameOver(true)
	}

	function onGameOver(newScore) {
		setGameOver(true)
		setScore(newScore)
	}

	return (
		<>
		{!gameOver && <SnakeGame onGameOver={onGameOver} {...snakeConf} />}
		{gameOver && 
			<div className="score-div">
				<p>You have lost!<br />You'r score was: 
				<strong>{score}</strong><br />
				<strong>¡Try Again!</strong></p>
				<span 
					className="reset" 
					onClick={e => setGameOver(false)}>
					Reset
				</span>
			</div>
		}
		<div className="switch">
			<ThemeSwitcher />
		</div>
		</>
	)
}