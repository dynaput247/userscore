import { useState, useEffect } from 'react';
import styled from 'styled-components';

const START_TOP_OFFSET = 25;
const circleConfig = {
    viewBox: '0 0 48 59',
    x: '24',
    y: '24',
    radio: '12',
    outerRadio: '14',
};

const CircleProgressBarBase = ({
    className,
    strokeColor,
    strokeWidth = 4.1,
    innerText, percentage = 0,
    trailStrokeWidth = 4,
    trailStrokeColor = 'var(--trail-stroke',
    trailSpaced, speed = 20,
}: CircleProgressBarProps) => {
    const [progressBar, setProgressBar] = useState(0);
    const pace = percentage / speed;

    const updatePercentage = () => {
        const timeout = setTimeout(() => {
            if (progressBar < percentage) {
                setProgressBar(progressBar + 1);
            }
            if (progressBar > percentage) {
                setProgressBar(progressBar - 1);
            }
        }, pace);
        return timeout;
    };

    useEffect(() => {
        updatePercentage();
        return () => clearTimeout(updatePercentage());
    }, [progressBar, percentage]);

    return (
        <figure className={className}>
            <svg viewBox={circleConfig.viewBox}>
                <circle
                    className="outer-circle"
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                    r={circleConfig.outerRadio}
                    strokeWidth="8" />
                <circle
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                    r={circleConfig.radio}
                    fill="transparent"
                    stroke={trailStrokeColor}
                    strokeWidth={trailStrokeWidth}
                    strokeDasharray={trailSpaced ? 1 : 0} />
                <circle
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                    r={circleConfig.radio}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${progressBar} ${100 - progressBar}`}
                    strokeDashoffset={START_TOP_OFFSET} />
                <g className="chart-text">
                    <text x="50%" y="50%" className="chart-number">
                        {percentage}
                    </text>
                    <text x="50%" y="50%" className="chart-label">
                        {innerText}
                    </text>
                </g>
            </svg>
        </figure>
    );
};
interface CircleProgressBarProps {
    className?: string;
    strokeColor?: string;
    strokeWidth?: number;
    innerText?: string;
    legendText?: string;
    percentage?: number;
    trailStrokeWidth?: number;
    trailStrokeColor?: string;
    trailSpaced?: boolean;
    speed?: number;
    textColor?: string;
    maxSize?: string;
}

export const CircleProgressBar = styled(CircleProgressBarBase)`
  max-width: ${props => props.maxSize};
  vertical-align: middle;
  .chart-text {
    fill: ${props => props.textColor};
    transform: translateY(0.25em);
  }
  .chart-number {
    font-size: 0.7em;
    line-height: 1;
    text-anchor: middle;
    transform: translateY(-0.5em);
    font-family: 'Arial Nova Light', sans-serif;
  }
  .chart-label {
    font-size: 0.3em;
    text-transform: uppercase;
    text-anchor: middle;
    transform: translateY(3.7em);
    fill: var(--secondary);
    font-weight: 600;
    font-family: 'Arial Nova', sans-serif;
  }
`;

CircleProgressBar.defaultProps = {
    textColor: 'var(--row-text)',
    maxSize: '100px'
};

export default CircleProgressBar;
