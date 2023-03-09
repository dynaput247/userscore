import { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { VariableSizeGrid as Grid } from 'react-window';
import CircleProgressBar from './CircleProgressBar'

export default function ScoreTable() {
    const [day, setDay] = useState('1677658893169')

    const changeDay = (e: any) => {
        const days = Object.values(scores)[0]
        const day = Object.keys(days)[e]
        setDay(day)
    }

    const getDaysFromUserScores = () => {
        const days = Object.values(scores)[0]
        return days ? Object.keys(days) : []
    }

    const convertTimestampToDay = (timestamp: string) => {
        const date = new Date(parseInt(timestamp))
        return date.toUTCString()
    }

    const generateRandomData = () => {
        const randomData: ScoreData = {}
        const exampleNames = ['Jack', 'Jill', 'John', 'Jane', 'Joe', 'Jen', 'Patric', 'Mark']
        // generate 1000000 random names using the example names
        const uniqueNames = [];
        for (let i = 0; i < 20000; i++) {
            uniqueNames.push(`${exampleNames[Math.floor(Math.random() * exampleNames.length)]}${i}`)
        }
        // generate object with random scores
        uniqueNames.forEach(name => {
            randomData[name] = {
                "1677658893169": {
                    "ac": true,
                    "cs": Math.floor(Math.random() * 100),
                    "es": Math.floor(Math.random() * 100),
                    "ps": Math.floor(Math.random() * 100),
                    "sc": Math.floor(Math.random() * 100)
                },
                "1677749826815": {
                    "ac": true,
                    "cs": Math.floor(Math.random() * 100),
                    "es": Math.floor(Math.random() * 100),
                    "ps": Math.floor(Math.random() * 100),
                    "sc": Math.floor(Math.random() * 100)
                },
                "1677840221239": {
                    "ac": true,
                    "cs": Math.floor(Math.random() * 100),
                    "es": Math.floor(Math.random() * 100),
                    "ps": Math.floor(Math.random() * 100),
                    "sc": Math.floor(Math.random() * 100)
                }
            }
        })
        return randomData;

    }

    const scores = generateRandomData();

    const Cell = ({ columnIndex, rowIndex, style }: any) => {
        const name = Object.keys(scores)[rowIndex];
        const score = useMemo(() => {
            return scores?.[name]?.[day]?.sc;
        }, [scores, name, day]);
        return (
            <div style={style}
                className={
                    columnIndex % 2
                      ? rowIndex % 2 === 0
                        ? 'GridItemOdd'
                        : 'GridItemEven'
                      : rowIndex % 2
                      ? 'GridItemEven'
                      : 'GridItemOdd'
                  }
            >
                {columnIndex === 0 ? (<StyledCell>{name}</StyledCell>) : (
                    <StyledCell>
                    <CircleProgressBar
                        className="CircleProgressBar"
                        strokeColor={getLevelColor(score)}
                        percentage={score}
                        innerText={getLevelName(score)}
                        key={name}
                    />
                    </StyledCell>
                )}
            </div>
        );
    };

    return (
        <>
            <Select onChange={(e) => changeDay(parseInt(e.target.value))}>
                {getDaysFromUserScores()?.map((day, index) => (
                    <option key={index} value={index}>
                        {convertTimestampToDay(day)}
                    </option>
                ))}
            </Select>
            {/* Athlete Score Table */}
            <Header>
                        <span>Athlete</span>
                        <span>Score</span>
            </Header>
            <Grid
                className="Grid"
                columnCount={2}
                columnWidth={(index) => index === 0 ? 162 : 137}
                height={800}
                rowCount={Object.keys(scores).length}
                rowHeight={index => 130}
                width={300}
            >
                {Cell}
            </Grid>
        </>
    )
}

const StyledCell = styled.div`
    font-size: 14px;
    font-family: 'Arial Nova Cond', sans-serif;
    color: var(--row-text);
    text-transform: uppercase;
    font-weight: 600;
    position: relative;
    top: 60px;
    left: 20px;
    .CircleProgressBar {
        position: relative;
        bottom: 45px;
        right: 0px;
    }
`

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
    position: sticky;
    top: 0;
    z-index: 1;
`

interface Score {
    ac?: boolean
    cs?: number
    es?: number
    ps?: number
    sc: number
}

interface ScoreData {
    [name: string]: {
        [timestamp: string]: Score
    }
}

const Header = styled.div`
    width: 300px;
    height: 30px;
    border: 1px solid var(--secondary);
    background-color: var(--header-background);
    color: var(--row-text);
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: 600;
    span {
        border-right: 1px solid var(--secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 137px;
        font-family: 'Arial Nova Light', sans-serif;
        font-size: 14px;
        color: var(--secondary);
        font-weight: 600;
    }
    span:first-child {
        width: 163px;
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
