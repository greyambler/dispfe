import React from 'react';

import { get_Num, getColor_Crit, POST, get_Curent_Login } from '../../core/core_Function.jsx'

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
function get_ai_Image_L(_Fuels, el) {
    let name = "";
    let Image = '/images/TRK/null.png';
    if (_Fuels != null && el != null && el.fuel != null && !get_GoGet(el.state_trk)) {
        for (const item of _Fuels) {
            if (item.id == el.fuel) {
                name = item.fu;
                break;
            }
        }
        switch (name) {
            case "ДТ": {
                Image = '/images/TRK/DT.png';
                break;
            }
            case "98": {
                Image = '/images/TRK/98.png';
                break;
            }
            case "95": {
                Image = '/images/TRK/95.png';
                break;
            }
            case "92": {
                Image = '/images/TRK/92.png';
                break;
            }
        }
    }
    return Image;
}
function get_ai_Image_R(_Fuels, el) {
    let name = "";
    let Image = '/images/TRK/null.png';
    if (_Fuels != null && el != null && el.fuel != null && get_GoGet(el.state_trk)) {
        for (const item of _Fuels) {
            if (item.id == el.fuel) {
                name = item.fu;
                break;
            }
        }
        switch (name) {
            case "ДТ": {
                Image = '/images/TRK/Drop_DT.png';
                break;
            }
            case "98": {
                Image = '/images/TRK/Drop_98.png';
                break;
            }
            case "95": {
                Image = '/images/TRK/Drop_95.png';
                break;
            }
            case "92": {
                Image = '/images/TRK/Drop_92.png';
                break;
            }
        }
    }
    return Image;
}
function get_Image_Centr(el) {
    let Image = '';//images/TRK/001.png';
    if (get_GoGet(el.state_trk)) {
        Image = '/images/TRK/Picked_up.png';
    } else {
        Image = '';
    }
    return Image;
}
function get_GoGet(state_trk) {
    switch (parseInt(state_trk)) {
        case 1: { return false; }//"Нет связи"; }
        case 2: { return false; }//"Закрыта"; }
        case 3: { return false; }//"Свободна"; }
        case 4: { return true; }//"Снят пистолет"; }
        case 5: { return true; }//"Идет налив"; }
        case 6: { return true; }//"Выдано разрешение"; }
        case 7: { return false; }//"Завершение налива"; }
        case 8: { return true; }//"Включен автоналив"; }
        case 9: { return false; }//"Выключен автоналив"; }
        case 10: { return false; }//"Заблокирована"; }
        case 11: { return false; }//"Разблокирована"; }
        default: { return false; }//"Нет связи"; }
    }
}


function get_lock(el) {
    let Image = '/images/Lock.png';
    switch (parseInt(el.state_trk)) {
        case 3:  //"Свободна"; }
        case 4:  //"Снят пистолет"; }
        case 5:  //"Идет налив"; }
        case 6:  //"Выдано разрешение"; }
        case 7:  //"Завершение налива"; }
        case 8:  //"Включен автоналив"; }
        case 9:  //"Выключен автоналив"; }
        case 11: { Image = '/images/noLock.png'; break; }//"Разблокирована"; }

        case 1:  //"Нет связи"; }
        case 2:  //"Закрыта"; }
        case 10: //"Заблокирована"; }
        default: { Image = '/images/Lock.png'; break; }//"Нет связи"; }
    }
    return Image;
}
function get_status_text(el) {
    switch (parseInt(el.state_trk)) {
        case 0: { return "Нет связи"; }
        case 1: { return "Нет связи"; }

        default: { return "В сети"; }
    }
}
function get_status_text_color(el) {
    switch (parseInt(el.state_trk)) {
        case 1: { return 'black'; }//"Нет связи"; }
        case 2: { return 'black'; }//"Закрыта"; }
        case 3: { return 'white'; }//"Свободна"; }
        case 4: { return 'white'; }//"Снят пистолет"; }
        case 5: { return 'white'; }//"Идет налив"; }
        case 6: { return 'white'; }//"Выдано разрешение"; }
        case 7: { return 'white'; }//"Завершение налива"; }
        case 8: { return 'white'; }//"Включен автоналив"; }
        case 9: { return 'white'; }//"Выключен автоналив"; }
        case 10: { return 'white'; }//"Заблокирована"; }
        case 11: { return 'white'; }//"Разблокирована"; }
        default: { return 'black'; }//"Нет связи"; }
    }
}
function get_dvc_Image(el) {
    if (el.state_trk == 0) {
        return '/images/TRK/Pistolet_offline.png';
    } else {
        if (get_GoGet(el.state_trk)) {
            return '/images/TRK/Pistolet_normal_r.png';
        } else {
            return '/images/TRK/Pistolet_normal.png';
        }
    }
}


export default class trk_Head extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);
        this.state = {

            lock_Image: get_lock(this.props.el),
            dvc_text: this.props.text,
            status_text: get_status_text(this.props.el),

            ai_Image_Centr: get_Image_Centr(this.props.el),

            ai_Image_L: get_ai_Image_L(this.props._Fuels, this.props.el),
            ai_Image_R: get_ai_Image_R(this.props._Fuels, this.props.el),

            dvc_Image: get_dvc_Image(this.props.el),

            style_Stage: (parseInt(this.props.el.state_trk) >= 3)
                ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },

            style_Text: get_status_text_color(this.props.el),
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.el != prevProps.el) {
            this.setState({

                lock_Image: get_lock(this.props.el),
                dvc_text: this.props.text,
                status_text: get_status_text(this.props.el),

                ai_Image_Centr: get_Image_Centr(this.props.el),

                ai_Image_L: get_ai_Image_L(this.props._Fuels, this.props.el),
                ai_Image_R: get_ai_Image_R(this.props._Fuels, this.props.el),

                dvc_Image: get_dvc_Image(this.props.el),

                style_Stage: (parseInt(this.props.el.state_trk) >= 3)
                    ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },

                style_Text: get_status_text_color(this.props.el)
            });
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
        let S_height = 200;
        return (
            <center title={this.state.message}>
                <Stage width={S_width} height={S_height} style={this.state.style_Stage}>
                    <Layer>

                        <Text x={2} y={5} text={this.state.dvc_text} fontSize={10}
                            fill={this.state.style_Text} />

                        <Text x={73} y={5} text={this.state.status_text} fontSize={10}
                            fill={this.state.style_Text} />

                        <Rect x={1} y={20} width={S_width - 3} height={S_height - 22} fill={'white'} />


                        <AZS_Image Image={this.state.ai_Image_L} _W='30' _H='30' _X={5} _Y={55} />
                        <AZS_Image Image={this.state.ai_Image_R} _W='30' _H='30' _X={S_width - 35} _Y={55} />
                        <AZS_Image Image={this.state.dvc_Image} _W='100' _H='110' _X={7} _Y={32} />


                        <AZS_Image Image='/images/TRK/TRK_icon.png' _W='30' _H='30' _X={44} _Y={S_height - 70}
                            show_Message={this.show_Message}
                            message='ТРК'
                        />
                        <AZS_Image Image='/images/TRK/Play.png' _W='30' _H='30' _X={5} _Y={S_height - 35}
                            show_Message={this.show_Message}
                            message='разрешить'
                        />
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


                        <AZS_Image Image={this.state.ai_Image_Centr} _W='30' _H='30' _X={44} _Y={35} />

                    </Layer>
                </Stage>
            </center>
        );
    }
}