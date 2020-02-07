import React, { Component } from 'react';
import { createGuid } from '../../core/core_Function.jsx'

import jsmpeg from 'jsmpeg';

export default class tso_camera extends Component {
    constructor(props) {
        super(props);

/*         this.player_1_Init = this.player_1_Init.bind(this);
        this.player_1_Pause = this.player_1_Pause.bind(this);
        this.player_1_Stop = this.player_1_Stop.bind(this);
 */        this.state = {
            player: null,
            address: null,//"ws://127.0.0.1:9999"
            id_Play: createGuid(),
        }
    }

    componentDidMount() {
        this.setState({ address: this.props.WS }, this.player_Init);
    }
    componentDidUpdate(prevProps) {
        if (this.props.WS != prevProps.WS) {
            this.setState({ address: this.props.WS }, this.player_Init);
        }
    }

    player_Init = () => {
        if (this.state.address != null && this.state.player == null) {
            var canvas = document.getElementById(this.state.id_Play);
            var websocket = new WebSocket(this.state.address);
            var player = new jsmpeg(websocket, { canvas: canvas });
            this.setState({ player: player });
        }
    }
    player_Pause = () => {
        if (this.state.player != null) {
            let r = 0;
            this.state.player.pause();
            this.setState({ player: null });
        }
    }

    player_Stop = () => {
        if (this.state.player != null) {
            let r = 0;
            this.state.player.stop();
            this.setState({ player: null });
        }
    }
    render() {
        var style = {
            background: "grey",
            width: "120px",
            height: "55px",
        }
        var style_btn = {
            width: "100%",
        }

        return (
            <div className="App">
                <center>
                    <table width="110px">
                        <tbody>
                            <tr>
                                <td>
                                    <button onClick={this.player_Init} style={style_btn} >Start</button>
                                </td>
                                <td>
                                    <button onClick={this.player_Stop} style={style_btn}>Stop</button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <canvas id={this.state.id_Play} style={style}></canvas>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            </div>
        );
    }
}