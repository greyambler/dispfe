import React from 'react';

import { get_Num, getColor_Crit, POST, WS, get_Json_String, Data_Read, createGuid } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Line, Circle, Shape } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'
//import { Button, Icon } from 'semantic-ui-react';

import W_prop_value from '../prop_value_new.jsx'
import W_tso_camera from '../TSO/tso_camera.jsx'

import W_tso_Table_Props_new from '../TSO/tso_Table_Props_new.jsx'


function cope_Mass(MASSIV) {
    if (MASSIV != null) {
        let NEW_MASSIV = new Array();
        for (const iterator of MASSIV) {
            NEW_MASSIV.push(iterator);
        }
        return NEW_MASSIV;
    }
    return null;
}
const _Is_Run_WS = false;

let timerId;

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
        this.toock_shift_stop = this.toock_shift_stop.bind(this);
        this.show_Message = this.show_Message.bind(this);
        this.Set_Prop = this.Set_Prop.bind(this);

        this.Set_Data = this.Set_Data.bind(this);

        /******** WS******************** */
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        /******** WS******************** */


        this.state = {
            list_data: this.props.list_data,
            is_View: this.props.is_View,

            dvc_text: this.props.text,

            lock_Image: get_lock(this.props.el.state_shift),
            close_Image: get_close(this.props.el.state_shift),

            status_text: get_status_text(this.props.el.state_shift),

            dvc_Image: get_dvc_Image(this.props.el.water_level, this.props.el.state_pl),

            style_Stage: (parseInt(this.props.el.state_shift) == 3) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },
            style_Text: (parseInt(this.props.el.state_shift) == 3) ? 'white' : 'black',

            message: "",

            /******** WS******************** */
            EL: this.props.el,
            list_dvc_id: null,


            Ws: WS,
            connection: null,
            messages: [],
            IsOpen: false,

            /******** WS******************** */




        }
    }

    Set_Prop(_EL) {
        this.setState({
            lock_Image: get_lock(_EL.state_shift),
            close_Image: get_close(_EL.state_shift),

            status_text: get_status_text(_EL.state_shift),

            dvc_Image: get_dvc_Image(_EL.water_level, _EL.state_pl),

            style_Stage: (parseInt(_EL.state_shift) == 3) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },
            style_Text: (parseInt(_EL.state_shift) == 3) ? 'white' : 'black',


            EL: _EL,
        });
    }
    Set_Data(data) {
        if (this.state.list_data != null) {

            let DATA = JSON.parse(data);
            for (const data_val of DATA.values) {

                if ("STATE_FR" == data_val.typ) {
                    let r = 0;
                }

                for (const iterator of this.state.list_data) {

                    if (iterator.key == data_val.typ) {
                        let VAL = data_val.val;
                        if (data_val.val.toString().includes('.') || data_val.val.toString().includes(',')) {
                            VAL = data_val.val.toFixed(2);
                        }
                        iterator.key_value = VAL.toString();
                        iterator.crit = data_val.crit;
                        this.setState({ list_data: this.state.list_data });
                        break;
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



    componentDidMount() {
        // this.setState({ list_data: this.props.list_data });

        this.setState({ List_dvc_azs: cope_Mass(this.props.list_dvc_azs) }
            //, this.start_ws()
        );
        this.setState({ list_dvc_id: this.props.list_ID_DVC });
        setTimeout(() => this.start_ws(), 15000);// 60000- 1мин
    }
    componentDidUpdate(prevProps) {
        if (this.props.list_data != prevProps.list_data) {
            this.setState({ list_data: this.props.list_data });
        }
        if (this.props.list_dvc_azs != prevProps.list_dvc_azs) {
            this.setState({ List_dvc_azs: cope_Mass(this.props.list_dvc_azs) }
                , this.restart()
            );
        }
        if (this.props.list_ID_DVC != prevProps.list_ID_DVC) {
            this.setState({ list_dvc_id: this.props.list_ID_DVC });
        }
        if (this.props.el != prevProps.el) {
            this.Set_Prop(this.props.el);
        }

    }



    /*     componentWillUnmount() {
            this.stop_ws();
        }
     */
    /******** WS******************** */

    restart() {
        if (_Is_Run_WS) {
            if (this.state.connection != null && this.state.IsOpen) {
                this.state.connection.close(1000, "Hello Web Sockets!");
                this.setState({ IsOpen: false, connection: null, data: null });
                /************************ */
                timerId = setInterval(() => this.start_ws(), 10000);
                /************************ */
            }
        }
    }
    start_ws(e) {
        if (_Is_Run_WS) {

            if (this.state.EL.dvc_id != null) {
                if (this.state.connection == null) {
                    this.state.connection = new WebSocket(this.state.Ws);
                    this.state.connection.onopen = evt => { this.OnOpen(evt.data) }//{ this.add_messages(evt.data) }
                    this.state.connection.onclose = evt => { this.add_messages(evt.data) }
                    this.state.connection.onerror = evt => { this.add_messages(evt.data) }

                    this.state.connection.onmessage = evt => {
                        if (evt.data != null) {
                            try {

                                if (evt.data != "") {
                                    //this.full_Key_Value(JSON.parse(evt.data));
                                    this.Set_Prop(Data_Read(evt.data, this.state.EL, this.props.azs));
                                    this.Set_Data(evt.data);
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
            if (this.state.EL.dvc_id != null && !this.state.IsOpen && this.state.list_dvc_id) {



                let m = new Array();
                m.push(this.state.EL.dvc_id);


                if (this.state.EL.dvc_id_m != null) {
                    for (const iterator of this.state.EL.dvc_id_m) {
                        m.push(iterator);
                    }
                }

                let MS = get_Json_String(m);


                //let MS = get_Json_String(this.state.list_dvc_id);
                this.state.connection.send(MS);
                this.setState({ messages: "", IsOpen: true })

            }
        }
    }
    stop_ws(e) {
        if (this.state.IsOpen) {
            this.state.connection.close(1000, "Hello Web Sockets!");
            this.setState({ connection: null, data: null, IsOpen: false });
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

        let style_td = {
            background: 'white',
            minWidth: '20px',
            width: '120px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            verticalAlign: 'top',
            fontSize: "14px",
            height: "25px",
            align: "center",

            whiteSpace: "nowrap",
        }

        //height="27px" align="center"
        let _bgcolor = 'white';
        if (this.props.el.crit != null) {
            let Crit = parseInt(this.props.el.crit);
            if (!isNaN(Crit)) {
                _bgcolor = getColor_Crit(Crit);
            }
        }


        let OBJ = this.props.OBJ;
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



                {/*                 {this.state.dvc_text.startsWith("ТСО1 на АЗС2") &&
                    <W_tso_camera WS="ws://172.23.16.18:9999" />
                }
                {!this.state.dvc_text.startsWith("ТСО1 на АЗС2") &&
                    <W_tso_camera WS="ws://172.23.16.18:9998" />
                }
 */}

                {this.state.is_View && this.state.list_data != null &&
                    <table width="99%">
                        <tbody>
                            {
                                this.state.list_data.map(item => {
                                    return (
                                        <tr key={createGuid()}>
                                            <td key={createGuid()} style={style_td}>
                                                <W_prop_value
                                                    el={this.props.el}
                                                    item={item}
                                                    prop_value={item.key_value}
                                                />
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


{/* 
    
    
    {this.state.is_View && this.state.list_data != null &&
                    <W_tso_Table_Props_new EL={this.state._EL} list_data={this.state.list_data}

                        text={this.props.text}
                        el={this.props.el}
                        azs={this.props.azs}
                        _Fuels={this.props.list_fuels}

                    />
                }
    
    
    */}