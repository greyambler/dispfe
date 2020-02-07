import React from 'react';

import { get_Num, getColor_Crit, POST } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Line, Circle, Shape } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'

const _Debuge = false;
const _Debuge_Message = true;


function get_cmd_mfc_ID(TCO) {
    let ID = null;
    if (TCO != null) {
        for (const item of TCO) {
            if (item != null && item.type == "cmd_mfc") {
                ID = item.dvc_id
                break;
            }
        }
    }
    return ID;
}
function get_restart(id, nameCommand) {
    let T_Json =
        '{' +
        '   "type": "cmd_mfc",' +
        '   "dev_id": "' + id + '",' +
        '   "obj": {' +
        '     "action": "' + nameCommand + '"' +
        '   }' +
        ' }'
    let y = JSON.parse(T_Json);
    let t_Json = JSON.stringify(y);
    return t_Json;
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
function get_Json_TEST(id) {
    let T_Json =
        '{' +
        '   "type": "cmd_mfc",' +
        '   "obj": {' +
        '     "dev_id": "' + id + '",' +
        '     "action": "restart_pc"' +
        '   }' +
        ' }'
    let y = JSON.parse(T_Json);
    let t_Json = JSON.stringify(y);
    return t_Json;

}



export default class tso_Rec_button_new extends React.Component {
    constructor(props) {
        super(props);
    }

    async toock(text, id, tco, type_Body) {///Отправка команды
        let rss = POST;
        let ID = (type_Body != "shift_stop") ? get_cmd_mfc_ID(tco) : null;// get_ID_cmd_TCO(tco);//get_AGENT_ID_cmd_mfc(tco);
        if (ID != null) {
            id = ID;
        }
        var myRequest = new Request(rss);
        let _body = null;
        switch (type_Body) {
            case 'restart_pc': _body = get_restart(id, "restart_pc"); break;
            case 'restart_fr': _body = get_restart(id, "restart_fr"); break;
            case 'restart_cash': _body = get_restart(id, "restart_cash"); break;

            case 'shift_stop': {
                let _code = Number(tco[tco.length - 1].STATE_SHIFT.code);
                if (!isNaN(_code)) {
                    switch (_code) {
                        case 2: {
                            _body = get_TCO(id, "shift_start");
                            break;
                        }
                        case 3: {
                            _body = get_TCO(id, "shift_stop");
                            break;
                        }
                    }
                }
                //TCO_0[TCO_0.length - 1].STATE_TSO.code
                // _body = get_TCO(id, "shift_close");
            }
                break;

            /*
            •	shift_open - открыть смену
            •	shift_close - закрыть смену
            •	shift_stop - остановить смену
            •	shift_start - запустить смену
            •	print_z_report - закрыть фискальную смену (с закрытием смены на ТУ 3в1)
            •	print_fin_report - печать финансового отчета
            */

            default: _body = get_Json_TEST(id); break;
        }

        if (_Debuge_Message) {
            if (_body != null) {
                alert("Команда " + text + "запроса =" + _body);
            } else {
                alert("Команда " + text + "запроса = null. Отмена");
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
                            tco[tco.length - 1].nm + ",\n id = " + id + ",\n команда = " +
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
    render() {
        return (
            <>
                {/*this.props.text*/}
                {this.props.IsButton &&
                    <table id="s_table">
                        <tbody>
                            <tr>
                                <td title={this.props.title}> Перезагрузка </td>
                                <td>
                                    <img src={'../images/rec_green.png'}
                                        width="22" height="22" id="img_Rec"
                                        onClick={() => this.toock(this.props.title, this.props.el.dvc_id, this.props.el_azsS, this.props.type_Body)}
                                        title={this.props.title} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                }
            </>
        );
    }
}
