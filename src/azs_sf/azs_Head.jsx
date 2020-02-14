import React from 'react';
import { get_Json_String} from '../core/core_Function.jsx'

const _Debuge = false;

export default class azs_Head extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    AZS_ERROR_Onclick(id_azs) {
        //alert("Тест = " + id_azs);
        //history={this.props.history}
        this.props.history.push('/azs_listerror&' + id_azs);
    }
    render() {
        let S_width = 120;
        let S_height = 200;
        let Head_Staly = {
            fontFamily: 'Neusa Next Pro',
            fontSize: '19px',
            lineHeight: '21px',
            //display: 'flex',
            //alignItems: 'flex - end',
            letterSpacing: '0.02em',
            textAlign: 'center',
            color: '#000000',

            whiteSpace: "nowrap",
        }
        let OBJ = this.props.OBJ;
        let style_td_D = {
            background: 'white',
            textAlign: 'left',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "35px",
            align: "left",
            fontSize: "9px",
        }
        return (
            <center><p style={Head_Staly}>{this.props.text}

                <button className='Min_button_White' title="Журнал ошибок"
                    onClick={() => this.AZS_ERROR_Onclick(this.props.ID)}>
                    <div align="center">
                        <img src='images/anim_engine.gif' width="15px" />
                    </div>
                </button>
            </p>

                {_Debuge &&
                    <table>
                        <tbody>
                            <tr>
                                <td style={style_td_D}>{"ID - " + OBJ.ID}</td>
                            </tr>
                            <tr>
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
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"crit - " + OBJ.crit}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"dvc_id - " + OBJ.dvc_id}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"dvc_id_m - " + get_Json_String(OBJ.dvc_id_m)}</td>
                            </tr>
                        </tbody>
                    </table>
                }
            </center>
        );
    }
}