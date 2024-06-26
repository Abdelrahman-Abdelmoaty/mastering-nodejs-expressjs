export function excludeFields<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const filteredEntries = Object.entries(obj).filter(
		([key]) => !keys.includes(key as K)
	);

	return Object.fromEntries(filteredEntries) as Omit<T, K>;
}
