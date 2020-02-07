import React from 'react';

import W_left_baner from './w_left_baner.jsx'
import W_table_azs from './w_table_azs.jsx'
import { Get_MainHead, WS } from '../core/core_Function.jsx'

function get_Json_String(mstring) {
    var mS = [];
    mS[0] = mstring;
    const T_Json = JSON.stringify(mstring);
    return T_Json;
}

const _Debuge = false;
const _Debuge_Show_Code = true;
const _Debuge_Alert = true;

export default class w_main_azs extends React.Component {
    constructor(props) {
        super(props);

        /******** WS******************** */
        this.start_ws = this.start_ws.bind(this);
        this.stop_ws = this.stop_ws.bind(this);
        this.OnOpen = this.OnOpen.bind(this);
        //this.restart = this.restart.bind(this);
        //this.test = this.test.bind(this);
        /******** WS******************** */

        this.state = {
            list_book: this.props.list_book,
            list_azs: this.props.list_azs,
            list_id: this.props.list_id,

            /******** WS******************** */
            Ws: WS,
            data: null,
            connection: null,
            messages: [],
            IsOpen: false,
            /******** WS******************** */
        }
    }
    componentDidMount() {
        //this.start_ws();
    }
    componentDidUpdate(prevProps) {
        if (this.props.list_id != prevProps.list_id) {
            //this.setState({ list_id: this.props.list_id }, this.start_ws());
        }
    }
    componentWillUnmount() {
        this.stop_ws();
    }
    /******** WS******************** */
    start_ws(e) {
        if (this.state.list_id != null) {
            if (this.state.connection == null) {

                this.state.connection = new WebSocket(this.state.Ws);
                this.state.connection.onopen = evt => { this.OnOpen(evt.data) }//{ this.add_messages(evt.data) }
                this.state.connection.onclose = evt => { this.add_messages(evt.data) }
                this.state.connection.onerror = evt => { this.add_messages(evt.data) }

                this.state.connection.onmessage = evt => {
                    if (evt.data != null) {
                        try {

                            if (evt.data != "") {
                                this.setState({ data: JSON.parse(evt.data) })// Рабочий
                                //this.add_messages("\n" + evt.data);
                                //console.log('***JSON*********************' + evt.data);
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
    OnOpen(e) {
        if (this.state.list_id != null) {
            if (this.state.list_id.length > 0 && !this.state.IsOpen) {
                let MS = get_Json_String(this.state.list_id);
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
        return (<W_table_azs
            list_book={this.state.list_book}
            list_azs={this.state.list_azs}
            _Debuge={_Debuge}
            _Debuge_Show_Code={_Debuge_Show_Code}
            _Debuge_Alert={_Debuge_Alert}
            data={this.state.data}
        />
        );
        /*
        return (
            <>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <W_left_baner
                                    list_book={this.state.list_book}
                                    list_azs={this.state.list_azs}
                                    _Debuge={_Debuge}
                                    _Debuge_Show_Code={_Debuge_Show_Code}
                                    _Debuge_Alert={_Debuge_Alert}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
        */
    }
}
