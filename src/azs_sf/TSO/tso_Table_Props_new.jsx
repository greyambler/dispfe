import React from 'react';

import { get_Num, getColor_Crit, POST, WS, get_Json_String, Data_Read, createGuid } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Line, Circle, Shape } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'
//import { Button, Icon } from 'semantic-ui-react';

import W_prop_value from '../prop_value_new.jsx'

import W_tso_Rec_button from './tso_Rec_button.jsx'
import W_tso_camera from './tso_camera.jsx'



const _Debuge_Message = true;

function get_lock(state_shift) {
    if (parseInt(state_shift) == 3) {
        return '/images/noLock.png';
    }
    return '/images/Lock.png';
}
function get_status_text(state_shift) {
    if (parseInt(state_shift) == 3) {
        return 'В сети';
    }
    return 'Нет связи';
}
function get_close(state_shift) {

    if (parseInt(state_shift) == 3) {
        return '/images/TSO/Off.png';
    }
    return '/images/TSO/On.png'
}


function get_dvc_Image(water_level, state_shift) {
    if (parseInt(state_shift) == 3) {
        switch (parseInt(water_level)) {
            case 1: { return '/images/PL/PL_FullNorm.png'; }        //{ _background = 'white'; break; }
            case 2: { return '/images/PL/PL_FullNormMinWater.png'; }//{ _background = 'yellow'; break; }
            case 3: { return '/images/PL/PL_MaxWater.png'; }        //{ _background = 'hotpink'; break; }
            default: { return '/images/PL/PL_FullNorm.png'; }       // = 'white';
        }
    } else {
        return '/images/TSO/TSO0.png';
    }
}
function get_TCO(id, nameCommand) {
    let T_Json =
        '{' +
        '   "type": "cmd_tso",' +
        '   "dev_id": "' + id + '",' +
        '   "obj": {' +
        '           "ctrl_value": "' + nameCommand + '",' +
        '           "shift_number": 1,' +
        '           "cashier_code": 1' +
        '       }' +
        ' }'
    let y = JSON.parse(T_Json);
    let t_Json = JSON.stringify(y);
    return t_Json;
}

const _Debuge_Show_Code = false;
const _Debuge_Show_Crit = false;

export default class tso_Table_Props_new extends React.Component {
    constructor(props) {
        super(props);
        this.toock_shift_stop = this.toock_shift_stop.bind(this);
        this.state = {
            list_data: this.props.list_data,
            EL: this.props._EL,
        }
    }


    /***Команды*********************** */

    /*
    •	shift_open - открыть смену
    •	shift_close - закрыть смену
    •	shift_stop - остановить смену
    •	shift_start - запустить смену
    •	print_z_report - закрыть фискальную смену (с закрытием смены на ТУ 3в1)
    •	print_fin_report - печать финансового отчета
    */

    async toock_shift_stop(el) {///Отправка команды // 'остановить/запустить смену'
        let rss = POST;
        var myRequest = new Request(rss);
        //alert('Отправка команды // остановить/запустить смену');
        let _body = null;
        let _code = parseInt(el.state_shift);
        let type_Body = "";

        if (!isNaN(_code)) {
            switch (_code) {
                case 2: {
                    type_Body = "shift_start";
                    _body = get_TCO(el.dvc_id, "shift_start");
                    break;
                }
                case 3: {
                    type_Body = "shift_stop";
                    _body = get_TCO(el.dvc_id, "shift_stop");
                    break;
                }
            }
        }
        if (_Debuge_Message) {
            if (_body != null) {
                alert("Команда " + 'остановить/запустить смену' + "запроса =" + _body);
            } else {
                alert("Команда " + 'остановить/запустить смену' + "запроса = null. Отмена");
            }
        }
        if (_body != null) {
            try {
                var response = await fetch(myRequest,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: _body,
                    }
                );
                const Jsons = await response.json();
                if (response.ok) {
                    this.setState({ _ANS: Jsons });
                    if (_Debuge_Message) {
                        alert("Команда получила ответ - " + Jsons.status + ",\n АЗК = " +
                            el.key_value + ",\n id = " + el.id + ",\n команда = " +
                            type_Body + ",\n запрос =" + _body);
                    } else {
                        alert("Команда ушла на сервер");
                    }
                }
                else {
                    throw Error(Jsons.message);
                }
            }
            catch (error) {
                console.log(error);
                alert(error);
            }
        }
    }

    send_Maile(_object, message) {
        let M = "Тест тело сообщения\n\r" + message;
        var link = "mailto:me@example.ru"
            + "&subject=" + _object
            + "&body=" + M;
        window.location.href = link;
    }

    show_Message(text) {
        this.setState({ message: text });
    }

    /***Команды*********************** */


    render() {
        let S_width = 120;
        let S_height = 184;

        let style_td = {
            background: 'white',
            minWidth: '20px',
            width: '120px',
            textAlign: 'center',
            bgcolor: "black",
            //border: '1px solid #F0F0F0',
            border: '1px solid #A5ABB3',
 
            verticalAlign: 'top',
            fontSize: "14px",
            height: "25px",
            align: "center",
            whiteSpace: "nowrap",
        }

        //height="27px" align="center"
        /*         let _bgcolor = 'white';
                if (this.props.el.crit != null) {
                    let Crit = parseInt(this.props.el.crit);
                    if (!isNaN(Crit)) {
                        _bgcolor = getColor_Crit(Crit);
                    }
                }
         */
        /*
                if (this.state.el.ID != 0 && this.state.el.type == "fr" && this.state.el.key == "nm" && text != "") {
                    //шапка ФР 
                    return (<center><W_tso_Rec_button text={text} title="Перезагрузка ФР" type_Body='restart_fr' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} /></center>);
                } else if (this.state.el.ID != 0 && this.state.el.type == "cash" && this.state.el.key == "nm" && text != "") {
                    //шапка Купюроприёмник	
                    return (<center><W_tso_Rec_button text={text} title="Перезагрузка Купюроприёмника" type_Body='restart_cash' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} /></center>);
                }
        */
        let text = (this.props.el == null) ? "" : get_Num(this.props.el, _Debuge_Show_Crit, _Debuge_Show_Code);
        return (

            <table width="99%">
                <tbody>
                    {
                        this.state.list_data.map(item => {
{/*                             if (item.ID == 0 && item.type == "fr" && item.key == "nm" && item.key_value != "") {
                                return (
                                    <tr key={createGuid()}>
                                        <td key={createGuid()} style={style_td}>
                                            <center>
                                                <W_tso_Rec_button text={text}
                                                    title="Перезагрузка ФР" type_Body='restart_fr' el={this.props.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} />
                                            </center>
                                        </td>
                                    </tr>
                                );

                            } else 
 */}                            {
                                return (
                                    <tr key={createGuid()}>
                                        <td key={createGuid()} style={style_td}>
                                            <W_prop_value el={item.key}
                                                prop_value={item.key_value}
                                            />
                                        </td>
                                    </tr>
                                );
                            }
                        })
                    }

                </tbody>
            </table>
        );
    }
}
