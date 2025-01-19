import React, { useEffect, useState } from "react";

interface TimedComponentProps {
	duration: number; // Duration in seconds
	children: React.ReactNode; // The component to show
	onTimeout?: () => void; // Callback when time is up
}

const TimedComponent: React.FC<TimedComponentProps> = ({
	duration = 1,
	children,
	onTimeout,
}) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			if (onTimeout) {
				onTimeout();
			}
		}, duration * 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [duration, onTimeout]);

	return <>{isVisible ? children : null}</>;
};

export default TimedComponent;
