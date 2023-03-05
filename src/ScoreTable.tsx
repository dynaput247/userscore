import { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function ScoreTable() {
    const [scores, setScores] = useState<ScoreData>({})
    const [day, setDay] = useState(0)

    const getDaysFromUserScores = () => {
        const days = Object.values(scores)[0]
        return days ? Object.keys(days) : []
    }

    const convertTimestampToDay = (timestamp: string) => {
        const date = new Date(parseInt(timestamp))
        return date.toUTCString()
    }

    useEffect(() => {
        fetch('/user-data.json')
            .then((res) => res.json())
            .then((data) => setScores(data))
            .catch((err) => console.error(err))
    }, [])

    return (
        <>
            <Select onChange={(e) => setDay(parseInt(e.target.value))}>
                {getDaysFromUserScores()?.map((day, index) => (
                    <option key={index} value={index}>
                        {convertTimestampToDay(day)}
                    </option>
                ))}
            </Select>
            <Table>
                <thead>
                    <tr>
                        <th>Athlete</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(scores).map(([name, data]) => (
                        <tr key={name}>
                            <td>{name}</td>
                            <td className="progress-circle-cell" >
                                <CircleProgressBar
                                    strokeColor={getLevelColor(Object.values(data)[day].sc)}
                                    percentage={Object.values(data)[day].sc}
                                    innerText={getLevelName(Object.values(data)[day].sc)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

const Select = styled.select`
    width: 300px;
    height: 30px;
    margin-bottom: 20px;
    border: 1px solid var(--secondary);
    border-radius: 5px;
    background-color: var(--background);
    color: var(--row-text);
    text-transform: uppercase;
    font-weight: 600;
    font-family: 'Arial Nova Light', sans-serif;
`

interface Score {
    sc: number
}

interface ScoreData {
    [name: string]: {
        [timestamp: string]: Score
    }
}

const Table = styled.table`
    width: 300px;
    border-collapse: collapse;
    color: var(--row-text);
    text-transform: uppercase;
    font-weight: 600;
    thead {
        color: var(--secondary);
    }
    tr:nth-child(even) {
        background-color: var(--background-even);
        .outer-circle {
            stroke: var(--outer-circle-even);
            fill: var(--outer-circle-even);
        }
    }
    tr:nth-child(odd) {
        background-color: var(--background);
        .outer-circle {
            stroke: var(--outer-circle);
            fill: var(--outer-circle);
        }
    }
    th {
        background-color: var(--header-background);
        text-align: center;
        font-family: 'Arial Nova Light', sans-serif;

    }
    th, td {
        border: 1px solid var(--secondary);
        padding: 8px;
    }
    td {
        padding-left: 17px;
    }
    .progress-circle-cell {
        padding-left: 25px;
        padding-top: 5px;
        padding-bottom: 5px;
  }
`

const START_TOP_OFFSET = 25;
const circleConfig = {
    viewBox: '0 0 48 59',
    x: '24',
    y: '24',
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
    trailStrokeColor = 'var(--trail-stroke',
    trailSpaced,
    speed = 20,
}: CircleProgressBarProps) => {
    const [progressBar, setProgressBar] = useState(0);
    const pace = percentage / speed;
    const updatePercentage = () => {
        setTimeout(() => {
            if (progressBar < percentage) {
                setProgressBar(progressBar + 1);
            }
            if (progressBar > percentage) {
                setProgressBar(progressBar - 1);
            }
        }, pace);
    };

    useEffect(() => {
        if (percentage > 0) updatePercentage();
    }, [percentage]);

    useEffect(() => {
        if (progressBar < percentage) updatePercentage();
        if (progressBar > percentage) updatePercentage();
    }, [progressBar]);

    return (
        <figure className={className}>
            <svg viewBox={circleConfig.viewBox}>
                <circle
                    className="outer-circle"
                    cx={circleConfig.x}
                    cy={circleConfig.y}
                    r={circleConfig.outerRadio}
                    strokeWidth="8"
                />
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
                    strokeDashoffset={START_TOP_OFFSET}
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

const CircleProgressBar = styled(CircleProgressBarBase)`
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
    transform: translateY(4.3em);
    fill: var(--secondary);
    font-weight: 600;
    font-family: 'Arial Nova', sans-serif;
  }
`;

CircleProgressBar.defaultProps = {
    textColor: 'white',
    maxSize: '100px'
};

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

const colorMap = {
    'Peak': 'var(--peak)',
    'Strong': 'var(--strong)',
    'Primed': 'var(--primed)',
    'Baseline': 'var(--baseline)',
    'Compromised': 'var(--compromised)',
    'Fatigued': 'var(--fatigued)',
    'Drained': 'var(--drained)',
}
