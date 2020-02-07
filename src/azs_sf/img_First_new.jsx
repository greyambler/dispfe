import React from 'react';

import { Stage, Layer, Rect, Text, Circle, Shape, Image } from 'react-konva';

import { get_Num, createGuid, get_Json_String } from '../core/core_Function.jsx'


import AZS_Image from '../controls/AZS_Image.jsx'

import W_prop_value from './prop_value_new.jsx'

const _Debuge = false;

export default class img_First_new extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_book: this.props.list_book,
            is_View: this.props.is_View,
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.list_book_pl != prevProps.list_book_pl) {
            this.setState({ list_book: this.props.list_book_pl });
        }
        if (this.props.isPL_View != prevProps.isPL_View) {
            this.setState({ is_View: this.props.isPL_View });
        }
    }

    render() {
        let style_td = {
            background: 'white',
            textAlign: 'right',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "25px",
            align: "right",

            whiteSpace: "nowrap",
        }
        let style_td_D = {
            background: 'white',
            textAlign: 'left',
            bgcolor: "black",
            border: '1px solid black',
            height: "45px",
            align: "left",
            fontSize: "9px",
            width: '170px'
            //whiteSpace: "nowrap",
        }
        let OBJ = this.props.OBJ;

        return (
            <center>
                {OBJ.main_type == "pl" &&
                    <Stage width='170' height='142' x={0} y={0}>
                        <Layer key='1'>
                            <AZS_Image Image='/images/PL.png'
                                _W='160' _H='90' _X={12} _Y={22} />
                        </Layer>
                    </Stage>
                }

                {OBJ.main_type == "pump" &&
                    <Stage width='170' height='170' x={0} y={0}>
                        <Layer key='1'>
                            <AZS_Image Image='/images/TRK.png'
                                _W='130' _H='100' _X={12} _Y={32} />
                        </Layer>
                    </Stage>
                }

                {OBJ.main_type == "tso" && OBJ.type == "tso" && this.props.TYPE == null &&
                    <Stage width='70' height='150' x={0} y={0}>
                        <Layer key='1'>
                            <AZS_Image Image='/images/TSO.png'
                                _W='50' _H='100' _X={12} _Y={22} />
                        </Layer>
                    </Stage>
                }
                {OBJ.type == "fr" && this.props.TYPE != null &&
                    <>tts</>
                }

                {_Debuge &&
                    <table>
                        <tbody>
                            <tr>
                                <td style={style_td_D}>{"ID - " + OBJ.ID}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"self_ID - " + OBJ.dvc_id}</td>
                            </tr>

                            {/* <tr>
                                <td style={style_td_D}>{"key - " + OBJ.key}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"key_value - " + OBJ.key_value}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"main_type - " + OBJ.main_type}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"type - " + OBJ.type}</td>
                            </tr> */}
                            <tr>
                                <td style={style_td_D}>{"crit - " + OBJ.crit}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"dvc_id - " + OBJ.dvc_id}</td>
                            </tr>
                            {/*                             <tr>
                                <td style={style_td_D}>{"dvc_id_m - " + get_Json_String(OBJ.dvc_id_m)}</td>
                            </tr>
 */}                        </tbody>
                    </table>
                }

                {this.state.is_View && this.state.list_book != null &&
                    <table width="99%">
                        <tbody>
                            {
                                this.state.list_book.map(item => {
                                    return (
                                        <tr key={createGuid()}>
                                            <td key={createGuid()} style={style_td}>
                                            <W_prop_value item={item} coll_let={20} />
                                                
                                            </td>
                                        </tr>
                                    );
                                })
                            }

                        </tbody>
                    </table>
                }

            </center>
        );
    }
}