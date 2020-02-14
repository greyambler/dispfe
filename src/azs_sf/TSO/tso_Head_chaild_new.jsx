import React from 'react';

import { get_Num, getColor_Crit, POST, WS, get_Json_String, Data_Read, createGuid } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Line, Circle, Shape } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'
//import { Button, Icon } from 'semantic-ui-react';

import Data_Property_TSO from "./Data_Property_TSO.jsx";

import W_prop_value from '../prop_value_new.jsx'
import W_tso_camera from '../TSO/tso_camera.jsx'

import W_tso_Table_Props_new from '../TSO/tso_Table_Props_new.jsx'


const _Is_Run_WS = false;
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

export default class tso_Head_chaild_new extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);
        this.toock_shift_stop = this.toock_shift_stop.bind(this);

        this.SET_PROPS_PL = this.SET_PROPS_PL.bind(this);
        this.SET_VALUE_ODJ = this.SET_VALUE_ODJ.bind(this);

        /******** WS******************** */
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        //this.is_Choose = this.is_Choose.bind(this);
        /******** WS******************** */

        this.state = {

            OBJ: this.props.OBJ,
            self_ID: this.props.OBJ.dvc_id,
            dvc_text: this.props.OBJ.key_value,
            status_text: "",

            is_View: this.props.is_View,

            _Fuels: this.props._Fuels,
            list_data: this.props.list_data,

            message: "",

            /******** WS******************** */
            Ws: WS,
            connection: null,
            messages: [],
            IsOpen: false,
            visible: this.props.visible,
            azs: this.props.azs,
            /******** WS******************** */
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

            this.setState({ dvc_Image: get_dvc_Image(this.state.OBJ.water_level, this.state.OBJ.state_pl) });     // ТАНК
            this.setState({ lock_Image: get_lock(this.state.OBJ.state_shift) });                          // ЗАМОК
            this.setState({ close_Image: get_close(this.state.OBJ.state_shift) });

            this.setState({ style_Stage: (parseInt(this.state.OBJ.state_shift) == 3) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' } });
            this.setState({ style_Text: (parseInt(this.state.OBJ.state_shift) == 3) ? 'white' : 'black' });

        } else {
            alert("ERROR!!! self_ID");
        }
    }
    async SET_VALUE_ODJ(data) {
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

    /******** WS******************** */
    
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
                                console.log('******WS******************' + error);
                                console.log('******WS******************' + evt.data);
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
    /******** WS******************** */

    render() {
        let S_width = 120;
        let S_height = 184;

        let _style_tbl = {
            background: 'white',
            height: '50px',
            width: '100%',
            //minWidth:'200px',
            verticalAlign: 'top',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
        }

        let style_td = {
            background: 'white',
            minWidth: '20px',
            width: '120px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            verticalAlign: 'middle',
            fontSize: "14px",
            height: "25px",
            align: "center",

            whiteSpace: "nowrap",
        }
        let style_td_D = {
            background: 'white',
            textAlign: 'left',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "25px",
            align: "left",
            fontSize: "9px",

            //whiteSpace: "nowrap",
        }

        //let VAL = (this.state.dvc_text.length < 14) ? this.state.dvc_text : this.state.dvc_text.substring(0, 14);

        return (
            <center title={this.state.message}>
                <div style={_style_tbl} title={this.state.dvc_text} >{this.state.dvc_text}</div>

                {_Debuge &&
                    <table>
                        <tbody>
                            <tr>
                                <td style={style_td_D}>{"ID - " + this.state.OBJ.ID}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"self_ID - " + this.state.self_ID}</td>
                            </tr>
                            {/* <tr>
                                <td style={style_td_D}>{"key - " + this.state.OBJ.key}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"key_value - " + this.state.OBJ.key_value}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"main_type - " + this.state.OBJ.main_type}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"type - " + this.state.OBJ.type}</td>
                            </tr>*/}
                            <tr>
                                <td style={style_td_D}>{"crit - " + this.state.OBJ.crit}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"dvc_id - " + this.state.OBJ.dvc_id}</td>
                            </tr>
                            {/*                             <tr>
                                <td style={style_td_D}>{"dvc_id_m - " + get_Json_String(this.state.OBJ.dvc_id_m)}</td>
                            </tr>
 */}                        </tbody>
                    </table>
                }

                <Data_Property_TSO list_book={this.state.list_data} />

                {/* this.state.is_View && this.state.list_data != null &&
                    <table width="99%">
                        <tbody>
                            {
                                this.state.list_data.map(item => {
                                    return (
                                        <tr key={createGuid()}>
                                            <td key={createGuid()} style={style_td}>
                                                <W_prop_value item={item} />
                                            </td>
                                        </tr>
                                    );
                                })
                            }

                        </tbody>
                    </table>
                */ }
            </center>
        );
    }
}
