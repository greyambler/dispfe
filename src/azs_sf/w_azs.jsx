import React from 'react';

import W_table_azs from './w_table_azs.jsx'

import { WS, get_Json_String } from '../core/core_Function.jsx'

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
const _Debuge = false;

const _Is_Run_WS = true;

let timerId;

export default class w_azs extends React.Component {
    constructor(props) {
        super(props);
        this.full_Key_Value = this.full_Key_Value.bind(this);
        this.get_Fuel_Code = this.get_Fuel_Code.bind(this);

        /******** WS******************** */
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        /******** WS******************** */

        this.state = {
            List_dvc_azs: null,


            /******** WS******************** */
            Ws: WS,
            connection: null,
            messages: [],
            IsOpen: false,

            /******** WS******************** */

        }
    }
    componentDidMount() {
        this.setState({ List_dvc_azs: cope_Mass(this.props.list_dvc_azs) }
            , this.start_ws()
        );
    }
    componentDidUpdate(prevProps) {
        if (this.props.list_dvc_azs != prevProps.list_dvc_azs) {

            this.setState({ List_dvc_azs: cope_Mass(this.props.list_dvc_azs) }
                , this.restart()
            );

        }
    }
    componentWillUnmount() {
        this.stop_ws();
    }

    /******** WS******************** */

    restart() {
        if (_Is_Run_WS) {
            if (this.state.connection != null && this.state.IsOpen) {
                this.state.connection.close(1000, "Hello Web Sockets!");
                this.setState({ IsOpen: false, connection: null, data: null });
                /************************ */
                //timerId = setInterval(() => this.start_ws(), 10000);

                setTimeout (() => this.start_ws(), 10000);// 60000- 1мин

                /************************ */
            }
        }
    }
    start_ws(e) {
        if (_Is_Run_WS) {

            if (this.props.list_dvc_id != null) {
                if (this.state.connection == null) {
                    this.state.connection = new WebSocket(this.state.Ws);
                    this.state.connection.onopen = evt => { this.OnOpen(evt.data) }//{ this.add_messages(evt.data) }
                    this.state.connection.onclose = evt => { this.add_messages(evt.data) }
                    this.state.connection.onerror = evt => { this.add_messages(evt.data) }

                    this.state.connection.onmessage = evt => {
                        if (evt.data != null) {
                            try {

                                if (evt.data != "") {
                                    this.full_Key_Value(JSON.parse(evt.data));
                                    let r = 0;
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
            if (this.props.list_dvc_id != null) {
                if (this.props.list_dvc_id.length > 0 && !this.state.IsOpen) {
                    let MS = get_Json_String(this.props.list_dvc_id);
                    this.state.connection.send(MS);
                    this.setState({ messages: "", IsOpen: true })
                }
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
    async full_Key_Value(data) {
        if (this.state.List_dvc_azs != null && data != null) {
            for (const data_val of data.values) {
                for (const azs of this.state.List_dvc_azs) {
                    for (const dvc of azs) {
                        if (data.id == dvc.dvc_id) {
                            switch (data_val.typ) {
                                case "STATE_PL": dvc.state_pl = data_val.val; break;
                                case "WATER_LEVEL": dvc.water_level = data_val.crit; break;
                                case "STATE_SHIFT": dvc.state_shift = data_val.val; break;
                                case "STATUS_TRK":
                                    {
                                        dvc.state_trk = data_val.val;
                                        break;
                                    }
                                case "nozzle":
                                    {
                                        if (data_val.val != 0) {
                                            let _fuel = await this.get_Fuel_Code(data, data_val, azs);
                                            dvc.fuel = _fuel;
                                        } else {
                                            dvc.fuel = 0;
                                        }
                                        break;
                                    }
                            }
                            if (dvc.key == data_val.typ) {
                                if (data_val.comment != null) {
                                    dvc.key_value = data_val.comment;
                                } else {
                                    dvc.key_value = data_val.val;
                                }
                                dvc.crit = data_val.crit;
                            }
                        }
                    }
                }
            }
            this.setState({ List_dvc_azs: this.state.List_dvc_azs });
        }
    }
    render() {
        return (
            <W_table_azs
                w_Height={this.props.w_Height}
                w_Width={this.props.w_Width}

                list_book_row={this.props.list_book_row}
                list_fuels={this.props.list_fuels}
                List_dvc_azs={this.state.List_dvc_azs}

                history={this.props.history}

            />
        );
    }
}
