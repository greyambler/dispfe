import React from 'react';
import { POST, WS, get_Json_String } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text } from 'react-konva';

import AZS_Image from '../../controls/AZS_Image.jsx'
import Data_Property_PL from "./Data_Property_PL.jsx";

const _Is_Run_WS = false;
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

export default class pl_Head_new extends React.Component {
    constructor(props) {
        super(props);
        this.show_Message = this.show_Message.bind(this);
        this.toock = this.toock.bind(this);

        this.SET_PROPS_PL = this.SET_PROPS_PL.bind(this);
        this.SET_VALUE_ODJ = this.SET_VALUE_ODJ.bind(this);

        // WS
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        //  WS

        this.state = {

            OBJ: this.props.OBJ,
            self_ID: this.props.OBJ.dvc_id,
            dvc_text: this.props.OBJ.key_value,
            status_text: "",

            is_View: this.props.is_View,

            _Fuels: this.props._Fuels,
            list_data: this.props.list_data,

            message: "",

            //  WS
            Ws: WS,
            connection: null,
            messages: [],
            IsOpen: false,
            visible: this.props.visible,
            //  WS
        }
    }
    componentDidMount() {
        try {
            this.SET_PROPS_PL();
            //setTimeout(() => this.start_ws(), 10000);// 60000- 1мин
            this.start_ws();
        } catch (e) {
        }
    }
    componentDidUpdate(prevProps, prevState) {

        if (this.props.is_View != prevProps.is_View) {
            this.setState({ is_View: this.props.is_View }, this.is_Choose(this.props.visible));
        }
        if (this.props.visible != prevProps.visible) {
            this.setState({ visible: this.props.visible }, this.is_Choose(this.props.visible));
        }
        if (this.props.OBJ != prevProps.OBJ) {
            this.setState({ OBJ: this.props.OBJ }, this.SET_PROPS_PL());
        }

        /*         if (this.state.sliderValue !== prevState.sliderValue) {
                    global.IS_PL_View = this.state.sliderValue;
                }
         */
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
            this.setState({ status_text: get_status_text(this.state.OBJ.state_pl) });                  //nm ШАПКА
            this.setState({ ai_Image: get_ai_Image(this.state._Fuels, this.state.OBJ) });              //ТОПЛИВО
            this.setState({ dvc_Image: get_dvc_Image(this.state.OBJ.water_level, this.state.OBJ.state_pl, this.state.OBJ.crit) });     // ТАНК
            this.setState({ lock_Image: get_lock(this.state.OBJ.state_pl) });                          // ЗАМОК
            this.setState({ style_Stage: (parseInt(this.state.OBJ.state_pl) == 1) ? { backgroundColor: '#7CA420', overflow: 'hidden' } : { backgroundColor: '#E0E0E0', overflow: 'hidden' } });
            this.setState({ style_Text: (parseInt(this.state.OBJ.state_pl) == 1) ? 'white' : 'black' });

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
    /*   is_Choose(visible) {
          if (visible) {
              if (_Debug_Is_Run_WS) {
                  alert(" is_Choose self_ID = " + this.state.visible + " - " + this.state.self_ID)
              }
              this.stop_ws();
          } else {
              if (_Debug_Is_Run_WS) {
                  alert(" is_Choose self_ID = " + this.state.visible + " - " + this.state.self_ID)
              }
              this.restart();
          } 
      }
       async restart() {
          try {
              if (_Is_Run_WS) {
                  if (this.state.connection != null && this.state.IsOpen) {
                      if (_Debug_Is_Run_WS) {
                          alert(" restart self_ID = " + this.state.visible + " - " + this.state.self_ID)
                      }
                      await this.state.connection.close(1000, "Hello Web Sockets!");
                      this.setState({ IsOpen: false, connection: null, data: null });
     
                      await setInterval(() => this.start_ws(), 10000);
     
                  }
              }
          } catch (e) {
          }
      } */

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

                //let MS = get_Json_String(this.props.list_dvc_id);
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
        let S_height = 170;
        let style_td = {
            background: 'white',
            minWidth: '20px',
            width: '120px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            verticalAlign: 'center',
            fontSize: "11px",
            height: "25px",
            align: "center",

            whiteSpace: "nowrap",
        }
        let style_td_D = {
            background: 'white',
            textAlign: 'left',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "45px",
            align: "left",
            fontSize: "9px",
        }

        //let rrr = global.IS_PL_View;

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
                            on_Click={this.toock} el={this.state.OBJ}
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

                <Data_Property_PL list_book={this.state.list_data} />

            </center>
        );
    }
}
