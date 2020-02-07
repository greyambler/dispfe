import React from 'react';

import { get_Num, getColor_Crit, POST } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Line, Circle, Shape } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'
//import { Button, Icon } from 'semantic-ui-react';

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

export default class tso_Head extends React.Component {
    constructor(props) {
        super(props);
        this.toock_shift_stop = this.toock_shift_stop.bind(this);
        this.show_Message = this.show_Message.bind(this);

        this.state = {
            lock_Image: get_lock(this.props.el.state_shift),
            close_Image: get_close(this.props.el.state_shift),
            dvc_text: this.props.text,
            status_text: get_status_text(this.props.el.state_shift),

            dvc_Image: get_dvc_Image(this.props.el.water_level, this.props.el.state_pl),

            style_Stage: (parseInt(this.props.el.state_shift) == 3) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },
            style_Text: (parseInt(this.props.el.state_shift) == 3) ? 'white' : 'black',

            message: "",
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
        return (
            <center title={this.state.message}>

                <Stage width={S_width} height={S_height} style={this.state.style_Stage}>
                    <Layer>

                        <Text x={2} y={5} text={this.state.dvc_text} fontSize={10} fill={this.state.style_Text} />

                        <Text x={75} y={5} text={this.state.status_text} fontSize={10} fill={this.state.style_Text} />

                        <Rect x={1} y={20} width={S_width - 3} height={S_height - 22} fill={'white'} />

                        <AZS_Image Image={this.state.dvc_Image} _W='50' _H='110' _X={35} _Y={23} />

                        <AZS_Image Image={this.state.close_Image} _W='30' _H='30' _X={5} _Y={S_height - 35}
                            show_Message={this.show_Message}
                            message='закрыть'
                        />

                        <AZS_Image Image={this.state.lock_Image} _W='30' _H='30' _X={44} _Y={S_height - 35}
                            on_Click={this.toock_shift_stop}
                            el={this.props.el}
                            show_Message={this.show_Message}
                            message='остановить/запустить смену'
                        />

                        <AZS_Image Image='/images/mail.png' _W='30' _H='30' _X={83} _Y={S_height - 35}
                            on_Click={this.send_Maile}
                            show_Message={this.show_Message}
                            message='письмо'
                        />
                    </Layer>
                </Stage>

            </center>
        );
    }
}
