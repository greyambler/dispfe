import React from 'react';

import { get_Num } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Circle, Shape, Image } from 'react-konva';

import AZS_Image from '../../controls/AZS_Image.jsx'

export default class tso_chaild_First_new extends React.Component {
    constructor(props) {
        super(props);
        this.Click = this.Click.bind(this);
        this.state = {
            text_dvc: this.props.text_dvc,
            _up: this.props.UP,
            _arrow: this.props.UP ? "images/arrow_Up.png" : "images/arrow_Down.png",
            type: this.props.type,
        }
    }

    Click() {
        let _UP = !this.state._up;
        if (_UP) {
            this.setState({ _arrow: "images/arrow_Up.png" });
        } else {
            this.setState({ _arrow: "images/arrow_Down.png" });
        }
        this.props.setFilter(_UP, this.state.type);
    }

    render() {
        let _style_tbl = {
            background: 'white',
            height: '50px',
            width: '100%',
            minWidth:'200px',
            verticalAlign: 'top',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
        }
        let _style_td = {
            marginTop: '10px',
            color: '#1A2737',
            width: "30px",
        }
        return (
            <table style={_style_tbl} onClick={this.Click}>
                <tbody>
                    <tr>
                        <td onClick={this.Click}>
                            {this.state.text_dvc}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}