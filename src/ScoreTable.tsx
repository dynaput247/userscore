import { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function ScoreTable() {
    const [scores, setScores] = useState([])

    useEffect(() => {
        fetch('/user-data.json')
            .then((res) => res.json())
            .then((data) => setScores(data))
            .catch((err) => console.error(err))
    }, [])

    return (
        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(scores).map(([name, data]) => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td className="progress-circle" >
                            <CircleProgressBar
                                strokeColor={getLevelColor(Object.values(data)[0].sc)}
                                percentage={Object.values(data)[0].sc}
                                innerText={getLevelName(Object.values(data)[0].sc)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

const Table = styled.table`
    width: 300px;
    border-collapse: collapse;
    color: white;
    text-transform: uppercase;
    thead {
        color: #969696;
    }
    tr:nth-child(even) {
        background-color: #2c2c2c;
    }
    tr:nth-child(odd) {
        background-color: #434242;
    }
    th {
        background-color: #2c2c2c;
        text-align: center;

    }
    th, td {
        border: 1px solid #969696;
        padding: 8px;
    }
    td {
        text-align: center;
    }
    .progress-circle {
    /* margin left */
    /* margin-top: 200px */
    padding-left: 25px;
    padding-top: 5px;
    padding-bottom: 20px;
  }
`

interface Score {
    sc: number
}

interface ScoreData {
    [name: string]: {
        [timestamp: string]: Score
    }
}

const INITIAL_OFFSET = 25;
const circleConfig = {
    viewBox: '0 0 38 48',
    x: '19',
    y: '19',
    radio: '15.91549430918954',
    outerRadio: '19',
};

const CircleProgressBarBase = ({
    className,
    strokeColor,
    strokeWidth = 4,
    innerText,
    percentage = 0,
    trailStrokeWidth = 4,
    trailStrokeColor = '#353536',
    trailSpaced,
    speed = 13
} : CircleProgressBarProps) => {
    const [progressBar, setProgressBar] = useState(0);
    const pace = percentage / speed;
    const updatePercentage = () => {
        setTimeout(() => {
            setProgressBar(progressBar + 1);
        }, pace);
    };

    useEffect(() => {
        if (percentage > 0) updatePercentage();
    }, [percentage]);

    useEffect(() => {
        if (progressBar < percentage) updatePercentage();
    }, [progressBar]);

    return (
        <figure className={className}>
            <svg viewBox={circleConfig.viewBox}>
                {/* wrap circles in another circle */}
                <circle 
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                r={circleConfig.outerRadio} 
                strokeWidth={trailStrokeWidth}
                stroke="#4a4949" 
                fill="transparent"/>
                <circle
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                    r={circleConfig.radio}
                    fill="transparent"
                    stroke={trailStrokeColor}
                    strokeWidth={trailStrokeWidth}
                    strokeDasharray={trailSpaced ? 1 : 0}
                />
                <circle
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                    r={circleConfig.radio}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${progressBar} ${100 - progressBar}`}
                    strokeDashoffset={INITIAL_OFFSET}
                />
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

const CircleProgressBar = styled(CircleProgressBarBase)`
  max-width: ${props => props.maxSize};
  vertical-align: middle;
  .chart-text {
    fill: ${props => props.textColor};
    transform: translateY(0.25em);
  }
  .chart-number {
    font-size: 0.6em;
    line-height: 1;
    text-anchor: middle;
    transform: translateY(-0.25em);
  }
  .chart-label {
    font-size: 0.2em;
    text-transform: uppercase;
    text-anchor: middle;
    transform: translateY(5em);
  }
`;


CircleProgressBar.defaultProps = {
    textColor: 'white',
    maxSize: '100px'
};

interface CircleProgressBarProps {
    className?: string
    strokeColor?: string
    strokeWidth?: number
    innerText?: string
    legendText?: string
    percentage?: number
    trailStrokeWidth?: number
    trailStrokeColor?: string
    trailSpaced?: boolean
    speed?: number
    textColor?: string
    maxSize?: string
}

const colorMap = {
    'Peak': '#71FF00',
    'Strong': '#7BDB2E',
    'Primed': '#94CA69',
    'Baseline': '#BBD1AA',
    'Compromised': '#EFB50A',
    'Fatigued': '#EF780A',
    'Drained': '#F43B2B'
}

const getLevel = (score: number) => {
    if (score >= 84) {
        return 'Peak'
    } else if (score >= 70) {
        return 'Strong'
    } else if (score >= 60) {
        return 'Primed'
    } else if (score >= 40) {
        return 'Baseline'
    } else if (score >= 30) {
        return 'Compromised'
    } else if (score >= 17) {
        return 'Fatigued'
    } else {
        return 'Drained'
    }
}

const getLevelColor = (score: number) => {
    return colorMap[getLevel(score)]
}

const getLevelName = (score: number) => {
    return getLevel(score)
}
