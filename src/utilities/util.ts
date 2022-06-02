export function getData() {
	const data = Array(10000).fill(0).map(v => [
		(Math.random()-.5) * 2, (Math.random()-.5) * 2, (Math.random()-.5) * 2, 0, Math.random() * 255, Math.random() * 255,Math.random() * 255,
	]).flat()

	return data
}
