import React from 'react';

import { get_Num } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Circle, Shape, Image } from 'react-konva';

import AZS_Image from '../../controls/AZS_Image.jsx'

export default class trk_First extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let BTN_width = 170;
        let BTN_height = 170;
        return (
            <center>
                <Stage width={BTN_width} height={BTN_height} x={0} y={0}>
                    <Layer key='1' background='red' >
                        <AZS_Image Image='/images/TRK.png'
                            _W='130' _H='100' _X={12} _Y={32} />
                    </Layer>
                </Stage>
            </center>
        );
    }
}