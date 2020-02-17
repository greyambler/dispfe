import React from 'react';
import { POST, WS, get_Json_String } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text } from 'react-konva';

import AZS_Image from '../../controls/AZS_Image.jsx'
import Data_Property_TRK from "./Data_Property_TRK.jsx";

const _Is_Run_WS = true;
const _Debug_Is_Run_WS = false;
const _Debuge_Message = true;
const _Debuge = false;

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

export default class trk_Head_new extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);
        this.get_Fuel_Code = this.get_Fuel_Code.bind(this);

        this.SET_PROPS_PL = this.SET_PROPS_PL.bind(this);
        this.SET_VALUE_ODJ = this.SET_VALUE_ODJ.bind(this);

        // WS
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        this.restart = this.restart.bind(this);
        // WS

        this.state = {
            OBJ: this.props.OBJ,
            _Fuels: this.props._Fuels,
            list_data: this.props.list_data,
            azs: this.props.azs,

            self_ID: this.props.OBJ.dvc_id,
            dvc_text: this.props.OBJ.key_value,
            status_text: "",
            message: "",

            // WS
            Ws: WS,
            connection: null,
            messages: [],
            IsOpen: false,
            visible: this.props.visible,
            // WS
        }
    }
    componentDidMount() {
        try {
            this.SET_PROPS_PL();
            this.start_ws();
        } catch (e) {
        }
    }
    componentDidUpdate(prevProps) {

        if (this.props.is_View != prevProps.is_View) {
            this.setState({ is_View: this.props.is_View });
        }
        if (this.props.visible != prevProps.visible) {
            this.setState({ visible: this.props.visible }, this.is_Choose(this.props.visible));
        }
        if (this.props.OBJ != prevProps.OBJ) {
            this.setState({ OBJ: this.props.OBJ }, this.SET_PROPS_PL());
        }
    }
    componentWillUnmount() {
        if (this.state.connection != null) {
            this.state.connection.close();
        }
        this.stop_ws();
    }
    SET_PROPS_PL(data) {
        if (this.state.OBJ.dvc_id == this.state.self_ID && data != null) {
            this.SET_VALUE_ODJ(data);
        }
        if (this.state.OBJ.dvc_id == this.state.self_ID) {
            this.setState({ status_text: get_status_text(this.state.OBJ) });                  //nm ШАПКА
            this.setState({ ai_Image_Centr: get_Image_Centr(this.state.OBJ) });                        //ТОПЛИВО
            this.setState({ ai_Image_L: get_ai_Image_L(this.state._Fuels, this.state.OBJ) });
            this.setState({ ai_Image_R: get_ai_Image_R(this.state._Fuels, this.state.OBJ) });
            this.setState({ dvc_Image: get_dvc_Image(this.state.OBJ) });
            this.setState({ lock_Image: get_lock(this.state.OBJ) });                                   // ЗАМОК
            this.setState({ style_Stage: (parseInt(this.state.OBJ.state_trk) >= 3) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' } });
            this.setState({ style_Text: get_status_text_color(this.state.OBJ) });

        } else {
            alert("ERROR!!! self_ID");
        }
    }
    async get_Fuel_Code(data, data_val, azs) {
        let _fuel = 0;
        let mass_DVC_AZS = null;
        for (const dvc of azs) {
            if (data.id == dvc.dvc_id) {
                for (const _dvc of azs) {
                    if (_dvc.ID == dvc.ID && _dvc.key == "id" && _dvc.mass_DVC != null) {
                        mass_DVC_AZS = _dvc.mass_DVC;
                        break;
                    }
                }
            }
            if (data.id == dvc.dvc_id && dvc.key == data_val.typ && dvc.key == "nozzle" && mass_DVC_AZS != null) {
                for (const dev_A of mass_DVC_AZS) {
                    if (dev_A.typ == data_val.typ) {
                        if (dev_A.prop != undefined) {
                            for (const item_prop of dev_A.prop) {
                                if (item_prop.typ == 'NUM') {
                                    if (parseInt(item_prop.capacity) == parseInt(data_val.val)) {
                                        _fuel = dev_A.fuel;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return _fuel;
    }
    SET_VALUE_ODJ(data) {
        if (this.state.list_data != null) {
            let DATA = JSON.parse(data);
            if (DATA.id == this.state.self_ID) {

                for (const data_val of DATA.values) {
                    for (const iterator of this.state.list_data) {
                        if (iterator.key == data_val.typ) {
                            let VAL = data_val.val;

                            if (data_val.val.toString().includes('.') || data_val.val.toString().includes(',')) {
                                VAL = data_val.val.toFixed(2);
                            }


                            iterator.key_value = VAL;
                            iterator.crit = data_val.crit;
                            this.setState({ list_data: this.state.list_data });


                            switch (data_val.typ) {
                                case "STATE_PL":
                                    {
                                        this.state.OBJ.state_pl = data_val.val;
                                        break;
                                    }
                                case "WATER_LEVEL":
                                    {
                                        this.state.OBJ.water_level = data_val.val;
                                        //this.setState({ dvc_Image: get_dvc_Image(OBJ.water_level, OBJ.state_pl, data_val.crit) });     // ТАНК
                                        this.state.OBJ.crit = data_val.crit;
                                        break;
                                    }
                                case "STATE_SHIFT": this.state.OBJ.state_shift = data_val.val; break;
                                case "STATUS_TRK":
                                    {
                                        this.state.OBJ.state_trk = data_val.val;
                                        break;
                                    }
                                case "nozzle":
                                    {
                                        if (iterator.key_value == 0) {
                                            iterator.key_value = " ";
                                        }
                                        if (data_val.val != 0) {
                                            let _fuel = this.get_Fuel_Code(data, data_val, this.state.azs);
                                            data_val.fuel = _fuel;
                                        } else {
                                            data_val.fuel = 0;
                                        }
                                        break;
                                    }
                            }

                            if (data_val.comment != null) {
                                iterator.key_value = data_val.comment;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }


    // Команды
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
    // Команды

    // WS
    restart() {
        //alert("start_ws trk_Head_new");
        if (_Is_Run_WS) {
            if (this.state.connection != null && this.state.IsOpen) {
                this.state.connection.close(1000, "Hello Web Sockets!");
                this.setState({ IsOpen: false, connection: null, data: null });
                /************************ */
                //timerId = setInterval(() => this.start_ws(), 10000);

                setTimeout(() => this.start_ws(), 1000);// 60000- 1мин

                /************************ */
            }
        }
    }
    start_ws(e) {        
        if (_Is_Run_WS) {
            if (this.state.self_ID != null && !this.state.visible) {
                if (this.state.connection == null) {
                    if (_Debug_Is_Run_WS) {
                        alert(" start_ws self_ID = " + this.state.visible + " - " + this.state.self_ID)
                    }
                    this.state.connection = new WebSocket(this.state.Ws);
                    this.state.connection.onopen = evt => { this.OnOpen(evt.data) }//{ this.add_messages(evt.data) }
                    this.state.connection.onclose = evt => { this.add_messages(evt.data) }
                    this.state.connection.onerror = evt => { this.add_messages(evt.data) }

                    this.state.connection.onmessage = evt => {
                        if (evt.data != null) {
                            try {

                                if (evt.data != "") {
                                    this.SET_PROPS_PL(evt.data);
                                }
                                else {
                                    let r = 0;
                                }
                            } catch (error) {
                                console.log('*WS*' + error);
                                console.log('*WS*' + evt.data);
                            }
                        }
                    }
                }
            }
        }
    }
    OnOpen(e) {
        if (_Is_Run_WS) {
            if (this.state.self_ID != null && !this.state.IsOpen && !this.state.visible) {
                if (_Debug_Is_Run_WS) {
                    alert(" OnOpen self_ID = " + this.state.visible + " - " + this.state.self_ID)
                }
                let m = new Array();
                m.push(this.state.self_ID);
                let MS = get_Json_String(m);
                this.state.connection.send(MS);
                this.setState({ messages: "", IsOpen: true });
            }
        }
    }
    stop_ws(e) {
        try {
            if (this.state.connection != null || this.state.IsOpen) {
                if (_Debug_Is_Run_WS) {
                    alert(" stop_ws self_ID = " + this.state.visible + " - " + this.state.self_ID)
                }
                this.state.connection.close(1000, "Hello Web Sockets!");
                if (this.state.connection.readyState >= 2) {
                    this.setState({ connection: null, data: null, IsOpen: false });
                }
            }
        } catch (e) {
        }
    }
    add_messages(e) {
        if (e != null) {
            this.setState({
                messages: this.state.messages.concat("\n[ №" +
                    " " + " ]\n " + e + "\n")
            });
        }
    }

    // WS

    render() {
        let S_width = 120;
        let S_height = 202;

        let style_td_D = {
            background: 'white',
            textAlign: 'left',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "45px",
            align: "left",
            fontSize: "9px",
        }
        return (
            <center title={this.state.message}>
                <Stage width={S_width} height={S_height} style={this.state.style_Stage} onDblClick={this.restart}>
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
                            on_Click={this.toock} el={this.state.OBJ}
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

                {_Debuge &&
                    <table>
                        <tbody>
                            <tr>
                                <td style={style_td_D}>{"ID - " + this.state.OBJ.ID}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"self_ID - " + this.state.OBJ.dvc_id}</td>
                            </tr>


                            <tr>
                                <td style={style_td_D}>{"crit - " + this.state.OBJ.crit}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"dvc_id - " + this.state.OBJ.dvc_id}</td>
                            </tr>


                        </tbody>
                    </table>
                }

                <Data_Property_TRK list_book={this.state.list_data} />

            </center>
        );
    }
}