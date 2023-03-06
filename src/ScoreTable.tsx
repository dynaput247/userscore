import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import CircleProgressBar from './CircleProgressBar'

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
        fetch('/data/user-data.json')
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
        padding-left: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
  }
`

const getLevel = (score: number) => {
    if (score >= 84) {
        return 'Peak';
    } else if (score >= 70) {
        return 'Strong';
    } else if (score >= 60) {
        return 'Primed';
    } else if (score >= 40) {
        return 'Baseline';
    } else if (score >= 30) {
        return 'Compromised';
    } else if (score >= 17) {
        return 'Fatigued';
    } else {
        return 'Drained';
    }
};
export const getLevelColor = (score: number) => {
    return colorMap[getLevel(score)];
};
export const getLevelName = (score: number) => {
    return getLevel(score);
};
const colorMap = {
    'Peak': 'var(--peak)',
    'Strong': 'var(--strong)',
    'Primed': 'var(--primed)',
    'Baseline': 'var(--baseline)',
    'Compromised': 'var(--compromised)',
    'Fatigued': 'var(--fatigued)',
    'Drained': 'var(--drained)',
};

