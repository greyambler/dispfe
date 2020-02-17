import React from 'react';

import { get_Num, getColor_Crit, POST } from '../../core/core_Function.jsx'

import { Stage, Layer, Rect, Text, Line, Circle, Shape, Image } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'



const _Debuge_Message = true;

function get_PL(id, nameCommand) {
    let T_Json =
        '{"type": "cmd_trk",' +
        '"dev_id": "' + id + '",' +
        '"obj": {' +
        '           "ctrl_value": "' + nameCommand + '",' +
        '           "cashier_code": 1' +
        '       }' +
        ' }'
    let y = JSON.parse(T_Json);
    let t_Json = JSON.stringify(y);
    return t_Json;
}
function get_ai_Image(_Fuels, el) {
    let name = "";
    let Image = '/images/PL/null.png';
    if (_Fuels != null && el != null && el.fuel != null) {
        for (const item of _Fuels) {
            if (item.id == el.fuel) {
                name = item.fu;
                break;
            }
        }
        switch (name) {
            case "ДТ": {
                Image = '/images/PL/DT.png'
                break;
            }
            case "98": {
                Image = '/images/PL/98.png'
                break;
            }
            case "95": {
                Image = '/images/PL/95.png'
                break;
            }
            case "92": {
                Image = '/images/PL/92.png'
                break;
            }
        }
    }
    return Image;
}
function get_lock(state_pl) {
    if (parseInt(state_pl) == 1) {
        return '/images/noLock.png';
    }
    return '/images/Lock.png';
}
function get_status_text(state_pl) {
    if (parseInt(state_pl) == 1) {
        return 'В сети';
    }
    return 'Нет связи';
}

function get_dvc_Image(water_level, state_pl) {
    if (parseInt(state_pl) == 1) {
        switch (parseInt(water_level)) {
            case 1: { return '/images/PL/PL_FullNorm.png'; }        //{ _background = 'white'; break; }
            case 2: { return '/images/PL/PL_FullNormMinWater.png'; }//{ _background = 'yellow'; break; }
            case 3: { return '/images/PL/PL_MaxWater.png'; }        //{ _background = 'hotpink'; break; }
            default: { return '/images/PL/PL_FullNorm.png'; }       // = 'white';
        }
    } else {
        return '/images/PL/PL0.png';
    }
}


export default class pl_Head extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);
        this.state = {

            lock_Image: get_lock(this.props.el.state_pl),
            dvc_text: this.props.text,
            status_text: get_status_text(this.props.el.state_pl),
            ai_Image: get_ai_Image(this.props._Fuels, this.props.el),

            dvc_Image: get_dvc_Image(this.props.el.water_level, this.props.el.state_pl),

            style_Stage: (parseInt(this.props.el.state_pl) == 1) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },
            style_Text: (parseInt(this.props.el.state_pl) == 1) ? 'white' : 'black',

            message: "",
        }
    }

    /***Команды*********************** */
    async toock(el) {///Отправка команды

        let rss = POST;
        var myRequest = new Request(rss);

        let text = 'Блокировка резервуара';
        let _body = null;
        let _code = parseInt(el.state_pl);

        if (!isNaN(_code)) {
            if (_code == 1) {
                _body = get_PL(el.dvc_id, 'tank_lock');
            } else {
                _body = get_PL(el.dvc_id, 'tank_unlock');
            }
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
                    alert("Команда получила ответ - " + Jsons.status + ",\n АЗК = "
                        + el.key_value + ",\n id = " + el.dvc_id + ",\n команда = "
                        + (_code == 0) ? 'tank_unlock' : 'tank_lock' + ",\n запрос =" + _body);
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
        let S_height = 170;
        return (
            <center title={this.state.message}>
                <Stage width={S_width} height={S_height} style={this.state.style_Stage}>
                    <Layer>

                        <Text x={2} y={5} text={this.state.dvc_text} fontSize={10}
                            fill={this.state.style_Text} />

                        <Text x={70} y={5} text={this.state.status_text} fontSize={10}
                            fill={this.state.style_Text} />

                        <Rect x={1} y={20} width={S_width - 3} height={S_height - 22} fill={'white'} />

                        <AZS_Image Image={this.state.ai_Image} _W='30' _H='30' _X={S_width - 40} _Y={25} />

                        <AZS_Image Image={this.state.dvc_Image} _W='90' _H='110' _X={14} _Y={23} />

                        <AZS_Image Image={this.state.lock_Image} _W='30' _H='30' _X={44} _Y={S_height - 35}
                            on_Click={this.toock} el={this.props.el}
                            show_Message={this.show_Message}
                            message='блокировка'
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