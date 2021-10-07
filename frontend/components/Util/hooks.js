import { useCallback, useState } from "react";

export const useComponentSize = () => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	const onLayout = useCallback((event) => {
		const { width, height } = event.nativeEvent.layout;
		setSize({ width, height });
	}, []);

	return [size, onLayout];
};

export const useDimensions = () => {
    const [dimensions, setDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const onLayout = useCallback((event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setDimensions({ x, y, width, height });
    }, []);

    return [dimensions, onLayout];
};