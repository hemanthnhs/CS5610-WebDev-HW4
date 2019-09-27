import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Starter/>, root);
}

class Starter extends React.Component {
    constructor(props) {
        super(props);
        let tilesGenerated = this.getInitialTiles()
        this.state = {tileData: tilesGenerated};
        this.handleClick = this.handleClick.bind(this);
    }

    getInitialTiles() {
        let letters = 'ABCDEFGHABCDEFGH'.split('')
        let gameTiles = {}
        let iter = letters.length
        while (iter != 0) {
            //Referred https://flaviocopes.com/how-to-generate-random-number-between/ for random number generation
            //in a range
            let i = Math.floor(Math.random() * (iter));
            gameTiles[iter] = {}
            gameTiles[iter]['letter'] = letters.splice(i, 1)[0]
            gameTiles[iter]['status'] = "hide"
            gameTiles[iter]['count'] = 0
            iter--;
        }
        return gameTiles;
    }

    handleClick(event) {
        event.persist();
        let data = this.state.tileData;
        let currentActive = _.filter(data, {'status': 'active'})
        if (currentActive.length < 2) {
            if (data[event.target.id]['status'] != 'complete') {
                let activeKey = _.findKey(data, {'status': 'active'})
                if (activeKey != event.target.id) {
                    data[event.target.id]['status'] = 'active'
                    data[event.target.id]['count']++
                    this.setState({tileData: data})
                    if (activeKey != undefined) {
                        if (data[activeKey]['letter'] == data[event.target.id]['letter']) {
                            data[activeKey]['status'] = 'complete'
                            data[event.target.id]['status'] = 'complete'
                            this.setState({tileData: data})
                        } else {
                            let that = this;
                            setTimeout(function () {
                                data[activeKey]['status'] = 'hide'
                                data[event.target.id]['status'] = 'hide'
                                that.setState({tileData: data})
                            }, 1000);
                        }
                    }
                }
            }
        }
    }

    reset() {
        let tilesGenerated = this.getInitialTiles()
        this.setState({tileData: tilesGenerated})
    }

    getScore() {
        let score = 0;
        _.map(this.state.tileData, function (key, value) {
            score += key['count'];
        });
        return score;
    }

    fetchScore() {
        let completedTiles = _.filter(this.state.tileData, {'status': 'complete'})
        if (this.getScore() == 0) {
            return "Yet to start";
        } else if (completedTiles.length == 16) {
            return "YOU WIN!!!!";
        }
        return "In Progress..";
    }

    render() {
        let grid_rows = []
        let grid_ind = 1
        for (let row = 1; row <= 4; row++) {
            let col_grids = []
            for (let col = 1; col <= 4; col++) {
                // Referred to reactjs documentation for handle click
                let id = grid_ind++
                let classVar = this.state.tileData[id]['status'] == 'hide' ? '' : 'tile-' + this.state.tileData[id]['status']
                col_grids.push(<td key={id} id={id} className={'column column-21 tile ' + classVar}
                                   onClick={this.handleClick}>{this.state.tileData[id]['status'] != 'hide'
                    ? this.state.tileData[id]['letter'] : ''}</td>)
            }
            grid_rows.push(<tr key={row} className="row">{col_grids}</tr>)
        }
        let tiles = <span className="column column-40">
            <table>
                <tbody>{grid_rows}</tbody>
            </table>
        </span>;
        let status = <span className="column column-25 column-offset-10"><h1><u>Game Status</u></h1><h2>{this.fetchScore()}</h2></span>;
        let score = <span className="column column-20"><h1><u>Score</u></h1><h2>{this.getScore()}</h2></span>;
        let button = <span className="column column-10"><button
            onClick={this.reset.bind(this)}>Reset Game</button></span>
        return <div className="row">
            {tiles}
            {status}
            {score}
            {button}
        </div>;
    }
}

