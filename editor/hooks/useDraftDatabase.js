import { useRef } from 'preact-hooks';

export default function useDraftDatabase() {
	const apiRef = useRef();
	if (!apiRef.current) {
		const utilUnflattenMatrix = (matrixFlatten) => {
			return matrixFlatten.map(serializedLine => serializedLine.split(';'));
		};

		const getMatrixForCodename = (codename, { shouldReturnMatrixFlatten }) => {
			const serialized = localStorage.getItem(`draft-for-${codename}`);
			if (!serialized) {
				return;
			}

			const matrixFlatten = JSON.parse(serialized);
			if (!matrixFlatten) {
				return;
			}

			if (shouldReturnMatrixFlatten) {
				return matrixFlatten;
			}

			const matrix = utilUnflattenMatrix(matrixFlatten);

			return matrix;
		};

		const checkHasEntryForCodename = (codename) => {
			const draft = localStorage.getItem(`draft-for-${codename}`);

			return Boolean(draft);
		};

		const setMatrixForCodename = (codename, matrix) => {
			const matrixFlatten = matrix.map(values => values.join(';'));
			const serialized = JSON.stringify(matrixFlatten, null, 4);

			localStorage.setItem(`draft-for-${codename}`, serialized);
		};

		const deleteEntryForCodename = (codename) => {
			localStorage.removeItem(`draft-for-${codename}`);
		};

		apiRef.current = {
			checkHasEntryForCodename,
			getMatrixForCodename,
			setMatrixForCodename,
			deleteEntryForCodename,
			utilUnflattenMatrix,
		};
	}

	return apiRef.current;
}
