import React from 'react';
import { POST, WS, get_Json_String } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text } from 'react-konva';

import AZS_Image from '../../controls/AZS_Image.jsx'
import Data_Property_TSO from "./Data_Property_TSO.jsx";

const _Is_Run_WS = true;
const _Debug_Is_Run_WS = false;
const _Debuge_Message = false;
const _Debuge = false;

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

export default class tso_Head_new extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);
        this.toock_shift_stop = this.toock_shift_stop.bind(this);

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
            this.setState({ status_text: get_status_text(this.state.OBJ.state_shift) });                  //nm ШАПКА

            this.setState({ dvc_Image: get_dvc_Image(this.state.OBJ.water_level, this.state.OBJ.state_pl) });        // ТАНК
            this.setState({ lock_Image: get_lock(this.state.OBJ.state_shift) });                          // ЗАМОК
            this.setState({ close_Image: get_close(this.state.OBJ.state_shift) });

            this.setState({ style_Stage: (parseInt(this.state.OBJ.state_shift) == 3) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' } });
            this.setState({ style_Text: (parseInt(this.state.OBJ.state_shift) == 3) ? 'white' : 'black' });

        } else {
            alert("ERROR!!! self_ID");
        }
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
                                case "STATE_TSO":
                                    {
                                        //let text = get_Num(OBJ, false, false);
                                        let text = iterator.OP[data_val.val];
                                        if (text != undefined) {
                                            data_val.val = text;
                                        }
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
                            }
                            if (data_val.comment != null) {
                                iterator.key_value = data_val.comment;
                            }
                            //let text = get_Num(OBJ, false, false);
                            break;
                        }
                    }
                }
            }
        }
    }

    // Команды

    //•	shift_open - открыть смену
    //•	shift_close - закрыть смену
    //•	shift_stop - остановить смену
    //•	shift_start - запустить смену
    //•	print_z_report - закрыть фискальную смену (с закрытием смены на ТУ 3в1)
    //•	print_fin_report - печать финансового отчета

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
    // Команды

    // WS
    restart() {
        //alert("start_ws tso_Head_new");
        if (_Is_Run_WS) {
            if (this.state.connection != null && this.state.IsOpen) {
                this.state.connection.close(1000, "Hello Web Sockets!");
                this.setState({ IsOpen: false, connection: null, data: null });
                /************************ */
                //timerId = setInterval(() => this.start_ws(), 10000);

                setTimeout (() => this.start_ws(), 1000);// 60000- 1мин

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
            if (this.state.OBJ.dvc_id != null && !this.state.IsOpen) {
                if (_Debug_Is_Run_WS) {
                    alert(" OnOpen self_ID = " + this.state.visible + " - " + this.state.self_ID)
                }
                let m = new Array();
                m.push(this.state.self_ID);
                let MS = get_Json_String(m);
                this.state.connection.send(MS);
                this.setState({ messages: "", IsOpen: true })

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
        let S_height = 184;

        let style_td_D = {
            background: 'white',
            textAlign: 'left',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "25px",
            align: "left",
            fontSize: "9px",
        }
        return (
            <center title={this.state.message}>
                <Stage width={S_width} height={S_height} style={this.state.style_Stage} onDblClick={this.restart}>
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
                            on_Click={this.toock_shift_stop} el={this.state.OBJ}
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

                {_Debuge &&
                    <table>
                        <tbody>
                            <tr>
                                <td style={style_td_D}>{"ID - " + this.state.OBJ.ID}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"self_ID - " + this.state.self_ID}</td>
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

                <Data_Property_TSO list_book={this.state.list_data} />

            </center>
        );
    }
}
