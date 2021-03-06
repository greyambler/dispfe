import React from 'react';

import { get_Num, getColor_Crit, POST, WS, get_Json_String, Data_Read, createGuid, Get_PROPS_Single } from '../../core/core_Function.jsx'

import { Stage, Layer, Rect, Text, Line, Circle, Shape, Image } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../../controls/AZS_Image.jsx'

import W_prop_value from '../prop_value_new.jsx'
import W_prop_value_old from '../prop_value.jsx'



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
const _Is_Run_WS = true;

let timerId;

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

function get_dvc_Image(water_level, state_pl, crit) {
    if (parseInt(state_pl) == 1) {
        switch (parseInt(crit)) {
            case 1: { return '/images/PL/PL_FullNorm.png'; }        //{ _background = 'white'; break; }
            case 2: { return '/images/PL/PL_FullNormMinWater.png'; }//{ _background = 'yellow'; break; }
            case 3: { return '/images/PL/PL_MaxWater.png'; }        //{ _background = 'hotpink'; break; }
            default: { return '/images/PL/PL_FullNorm.png'; }       // = 'white';
        }
    } else {
        return '/images/PL/PL0.png';
    }
}

function get_dvc_Image_crit(water_crit, state_pl) {
    if (parseInt(state_pl) == 1) {
        switch (parseInt(water_crit)) {
            case 1: { return '/images/PL/PL_FullNorm.png'; }        //{ _background = 'white'; break; }
            case 2: { return '/images/PL/PL_FullNormMinWater.png'; }//{ _background = 'yellow'; break; }
            case 3: { return '/images/PL/PL_MaxWater.png'; }        //{ _background = 'hotpink'; break; }
            default: { return '/images/PL/PL_FullNorm.png'; }       // = 'white';
        }
    } else {
        return '/images/PL/PL0.png';
    }
}

export default class pl_Head_new_save extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);

        this.SET_PROPS_PL = this.SET_PROPS_PL.bind(this);
        this.SET_VALUE_ODJ = this.SET_VALUE_ODJ.bind(this);


        this.Set_Prop = this.Set_Prop.bind(this);
        this.Set_Data = this.Set_Data.bind(this);

        /******** WS******************** */
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        this.is_Choose = this.is_Choose.bind(this);
        /******** WS******************** */

        this.state = {

            OBJ: this.props.OBJ,
            self_ID: this.props.OBJ.dvc_id,
            dvc_text: this.props.OBJ.key_value,


            is_View: this.props.is_View,
            

            _Fuels: this.props._Fuels,



            /******************************
            ID_CONST: this.props.ID_CONST,
            //list_first: this.props.list_first,

            


            

            dvc_text: this.props.text,
            _Fuels: this.props._Fuels,

            lock_Image: get_lock(this.props.el.state_pl),

            status_text: get_status_text(this.props.el.state_pl),
            ai_Image: get_ai_Image(this.props._Fuels, this.props.el),

            dvc_Image: get_dvc_Image(this.props.el.water_level, this.props.el.state_pl),
            style_Stage: (parseInt(this.props.el.state_pl) == 1) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },
            style_Text: (parseInt(this.props.el.state_pl) == 1) ? 'white' : 'black',

            message: "",


            ******** WS******************** */
            EL: this.props.el,

            Ws: WS,
            connection: null,
            messages: [],
            IsOpen: false,

            visible: this.props.visible,

            /******** WS******************** */

        }
    }
    componentDidMount() {
        this.SET_PROPS_PL(this.props.OBJ);
        this.setState({ List_dvc_azs: cope_Mass(this.props.list_dvc_azs) }
            //, this.start_ws()
        );
        setTimeout(() => this.start_ws(), 5000);// 60000- 1мин
        this.setState({list_data: this.props.list_data});

    }

    Set_Prop(_EL) {
        this.setState({
            lock_Image: get_lock(_EL.state_pl),
            status_text: get_status_text(_EL.state_pl),
            ai_Image: get_ai_Image(this.state._Fuels, _EL),
            dvc_Image: get_dvc_Image(_EL.water_level, _EL.state_pl),
            style_Stage: (parseInt(_EL.state_pl) == 1) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' },
            style_Text: (parseInt(_EL.state_pl) == 1) ? 'white' : 'black',
            EL: _EL,
        });
    }

    SET_PROPS_PL(OBJ, data) {


        if (OBJ.dvc_id == this.state.self_ID && data != null) {


            this.SET_VALUE_ODJ(data, OBJ);

            /* let DATA = JSON.parse(data);
            for (const data_val of DATA.values) {

                if (DATA.id == OBJ.dvc_id) {
                    switch (data_val.typ) {
                        case "STATE_PL":
                            {
                                OBJ.state_pl = data_val.val;
                                break;
                            }
                        case "WATER_LEVEL":
                            {
                                OBJ.water_level = data_val.val;
                                //this.setState({ dvc_Image: get_dvc_Image(OBJ.water_level, OBJ.state_pl, data_val.crit) });     // ТАНК
                                OBJ.crit = data_val.crit;
                                break;
                            }
                        case "STATE_SHIFT": OBJ.state_shift = data_val.val; break;
                        case "STATUS_TRK":
                            {
                                OBJ.state_trk = data_val.val;
                                break;
                            }
                    }
                }
            } */
        }

        if (OBJ.dvc_id == this.state.self_ID) {
            this.setState({ status_text: get_status_text(OBJ.state_pl) });                  //nm ШАПКА
            this.setState({ ai_Image: get_ai_Image(this.state._Fuels, OBJ) });              //ТОПЛИВО
            this.setState({ dvc_Image: get_dvc_Image(OBJ.water_level, OBJ.state_pl, OBJ.crit) });     // ТАНК
            this.setState({ lock_Image: get_lock(OBJ.state_pl) });                          // ЗАМОК
            this.setState({ style_Stage: (parseInt(OBJ.state_pl) == 1) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' } });
            this.setState({ style_Text: (parseInt(OBJ.state_pl) == 1) ? 'white' : 'black' });

        } else {
            alert("ERROR!!! self_ID");
        }

    }


    SET_VALUE_ODJ(data, OBJ) {
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
                                        OBJ.state_pl = data_val.val;
                                        break;
                                    }
                                case "WATER_LEVEL":
                                    {
                                        OBJ.water_level = data_val.val;
                                        //this.setState({ dvc_Image: get_dvc_Image(OBJ.water_level, OBJ.state_pl, data_val.crit) });     // ТАНК
                                        OBJ.crit = data_val.crit;
                                        break;
                                    }
                                case "STATE_SHIFT": OBJ.state_shift = data_val.val; break;
                                case "STATUS_TRK":
                                    {
                                        OBJ.state_trk = data_val.val;
                                        break;
                                    }
                            }
 
                            break;
                        }
                    }
                }
            }
        }
    }



    componentDidUpdate(prevProps) {

        if (this.props.is_View != prevProps.is_View) {
            this.setState({ is_View: this.props.is_View });
        }


        /*         if (this.props.list_book != prevProps.list_book) {
                    this.setState({ list_book: this.props.list_book });//, this.Init_LIST_DATA());
                }
                
        
                if (this.props.visible != prevProps.visible) {
                    this.setState({ visible: this.props.visible }, this.is_Choose(this.props.visible));
                }
        
        
                if (this.props.list_dvc_azs != prevProps.list_dvc_azs) {
                    this.setState({ List_dvc_azs: cope_Mass(this.props.list_dvc_azs) }
                        , this.restart()
                    );
                }
                if (this.props.el != prevProps.el) {
                    this.Set_Prop(this.props.el);
                }
         */
    }
    componentWillUnmount() {
        this.stop_ws();
    }


    Set_Data(data) {
        if (this.state.list_data != null) {
            let DATA = JSON.parse(data);
            if (DATA.id == this.state.self_ID) {

                for (const data_val of DATA.values) {
                    for (const iterator of this.state.list_data) {
                        //if (this.state.ID_CONST == DATA.id) {
                        if (iterator.key == data_val.typ) {
                            let VAL = data_val.val;
                            if (data_val.val.toString().includes('.') || data_val.val.toString().includes(',')) {
                                VAL = data_val.val.toFixed(2);
                            }
                            iterator.key_value = VAL;
                            iterator.crit = data_val.crit;
                            this.setState({ list_data: this.state.list_data });
                            break;
                        }
                        //} else {
                        //    break;
                        //}
                    }
                }
            }
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



    /******** WS******************** */
    is_Choose(visible) {
        if (visible) {
            this.stop_ws();
        } else {


        }

    }

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
        else {
            alert(" restart self_ID = " + this.state.self_ID)
        }
    }
    start_ws(e) {
        if (_Is_Run_WS) {

            if (this.state.self_ID != null) {

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
                                    //this.Set_Prop(Data_Read(evt.data, this.state.EL, this.props.azs));
                                    //this.Set_Data(evt.data);

                                    this.SET_PROPS_PL(this.state.OBJ, evt.data);

                                    //this.SET_VALUE_ODJ(evt.data);
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
        else {
            //alert(" start_ws self_ID = " + this.state.self_ID)
        }
    }
    OnOpen(e) {
        if (_Is_Run_WS) {
            if (this.state.self_ID != null && !this.state.IsOpen) {


                let m = new Array();
                m.push(this.state.self_ID);
                let MS = get_Json_String(m);

                //let MS = get_Json_String(this.props.list_dvc_id);
                this.state.connection.send(MS);
                this.setState({ messages: "", IsOpen: true })

            }
        }
        else {
            //alert(" OnOpen self_ID = " + this.state.self_ID)
        }
    }
    stop_ws(e) {

        if (this.state.IsOpen) {
            this.state.connection.close(1000, "Hello Web Sockets!");
            timerId = setInterval(() => this.setState({ connection: null, data: null, IsOpen: false }), 1000);
        }

        if (!_Is_Run_WS) {
            alert(" stop_ws self_ID = " + this.state.self_ID)
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
        let S_height = 170;

        let style_td = {
            background: 'white',
            minWidth: '20px',
            width: '120px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            verticalAlign: 'top',
            fontSize: "11px",
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
            height: "45px",
            align: "left",
            fontSize: "9px",


        }
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

                {_Debuge &&
                    <table>
                        <tbody>
                            <tr>
                                <td style={style_td_D}>{"ID - " + OBJ.ID}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"self_ID - " + this.state.self_ID}</td>
                            </tr>
                            {/* <tr>
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
                            </tr>*/}
                            <tr>
                                <td style={style_td_D}>{"crit - " + OBJ.crit}</td>
                            </tr>
                            <tr>
                                <td style={style_td_D}>{"dvc_id - " + OBJ.dvc_id}</td>
                            </tr>
                            {/*                             <tr>
                                <td style={style_td_D}>{"dvc_id_m - " + get_Json_String(OBJ.dvc_id_m)}</td>
                            </tr>
 */}                        </tbody>
                    </table>
                }


                {this.state.is_View && this.state.list_data != null &&
                    <table width="99%">
                        <tbody>
                            {
                                this.state.list_data.map(item => {
                                    return (
                                        <tr key={createGuid()}>
                                            <td key={createGuid()} style={style_td}>
                                                <W_prop_value
                                                    item={item}
                                                //el={this.props.el}//"TOTAL_OBSERVED_VOLUME"
                                                //prop_value={item.key_value}//"Объем общий"
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
