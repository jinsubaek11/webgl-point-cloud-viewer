export function getData() {
	// const data = Array(10000).fill(0).map(v => [
	// 	(Math.random()-.5) * 1.5, (Math.random()-.5) * 1.5, (Math.random()-.5) * 1.5, 0, Math.random() * 255, Math.random() * 255,Math.random() * 255,
	// ]).flat()

	const data = Array(10000).fill(0).map(v => [
		(Math.random()-.5)*300, (Math.random()-.5)*300, (Math.random()) * 300, 0, Math.random() * 255, Math.random() * 255,Math.random() * 255,
	]).flat()

	// console.log(data)

	return data
}
