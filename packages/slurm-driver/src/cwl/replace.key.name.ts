export function replaceKeyName(script: Record<string, unknown>) {
	let newWordsObject: Record<string, unknown> = {};

	Object.keys(script).forEach(key => {
		if (key === 'namespaces' || key === 'schemas') {
			const newKey = `$${key}`;
			const newPair = { [newKey]: script[key] };
			newWordsObject = { ...newWordsObject, ...newPair };
			delete newWordsObject[key];
		} else {
			newWordsObject = { ...newWordsObject, [key]: script[key] };
		}
	});

	return newWordsObject;
}
