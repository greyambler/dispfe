import React from 'react';

import { Stage, Layer, Rect, Text, Circle, Shape, Image } from 'react-konva';

import AZS_Image from '../../controls/AZS_Image.jsx'

export default class pl_First extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let BTN_width = 170;
        let BTN_height = 140;
        return (
            <center>
                <Stage width={BTN_width} height={BTN_height} x={0} y={0}>
                    <Layer key='1'>
                        <AZS_Image Image='/images/PL.png'
                            _W='160' _H='90' _X={12} _Y={22} />
                    </Layer>
                </Stage>

            </center>
        );
    }
}