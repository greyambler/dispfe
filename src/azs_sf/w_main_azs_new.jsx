import React from 'react';
import { RSS_AZS, Get_Main_PROPS_AZS_Single, demoAsyncCall } from '../core/core_Function.jsx'

import W_table_azs from './w_table_azs_new.jsx'

const _Debuge = false;

export default class w_main_azs_new extends React.Component {
    constructor(props) {
        super(props);

        this.View_Modal_Err = this.View_Modal_Err.bind(this);
        this.View_Modal_Ok = this.View_Modal_Ok.bind(this);

        this.get_Id_Devices = this.get_Id_Devices.bind(this);
        this.state = {
            loading: true,//окно ожидания
            list_dvc_azs: null,
        }
    }
    // Modal_Alert ///окно ожидания
    componentWillUnmount() { }
    // Modal_Alert ///окно ожидания
    View_Modal_Err(stt) {//окно ожидания
        this.setState({ openModal_Err: stt });
    }
    View_Modal_Ok(stt) {//окно ожидания
        this.setState({ openModal_Ok: stt });
    }
    // Modal_Alert ///окно ожидания

    componentDidMount() {
        demoAsyncCall().then(() => this.setState({ loading: false }));//окно ожидания
        this.get_Id_Devices();
    }
    componentDidUpdate(prevProps) {
        if (this.props.list_azs_check != prevProps.list_azs_check) {
            this.get_Id_Devices();
        }
    }

    async get_Id_Devices() {
        let M = new Array();
        for (const iterator of this.props.list_azs_check) {
            if (iterator.check) {
                let m = await this.tick_azs_id(RSS_AZS, iterator.id);
                let mas = Get_Main_PROPS_AZS_Single(iterator, m, this.props.list_type_dvc);
                M.push(mas);
            }
        }
        this.setState({ list_dvc_azs: M });
    }
    async tick_azs_id(RES, id_azs) {
        let rss = RES + '/' + id_azs;
        var myRequest = new Request(rss);
        try {
            var response = await fetch(myRequest,
                {
                    method: 'GET',
                    headers:
                    {
                        'Accept': 'application/json',
                    },
                }
            );
            const Jsons = await response.json();
            if (response.ok) {
                let M = new Array();
                if (Jsons.devices != null) {
                    for (const item of Jsons.devices) {
                        M.push(item);
                    }
                }
                return M;
            }
            else {
                throw Error(response.statusText);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    render() {
        let _Width = window.innerWidth;
        let _Height = window.innerHeight;

        {
            // Ждать
            const { loading } = this.state;
            let div_Null_Data = {
                minWidth: _Width - 40,
                minHeight: _Height - 70,
            }
            if (loading) {
                let style_1 = {
                    marginTop: '130px',
                }
                return (
                    <div style={div_Null_Data}>
                        <center><h1>Запрос данных.</h1></center>
                        <center><img src='images/anim_engine.gif' style={style_1} /></center>
                        <hr width={_Width - 30} />
                    </div>
                );
            }
            // Ждать
        }

        if (this.state.list_dvc_azs != null) {

            return (
                <W_table_azs
                    history={this.props.history}
                    list_fuels={this.props.list_fuels}
                    list_book_row={this.props.list_book_row}
                    list_dvc_azs={this.state.list_dvc_azs}

                    visible={this.props.visible}

                    list_type_dvc={this.props.list_type_dvc}
                />
            );

        } else {

            let div_Null = {
                marginLeft: 5,
                minWidth: _Width - 40,
                minHeight: _Height - 70,
            }

            return (
                <div style={div_Null}>
                    <center><h4>{this.props.header}</h4></center>
                    <hr /><hr />
                    <h4><center>Нет данных!!(w_main_azs_new)</center></h4>
                    <hr width={this.props.w_Width - 30} />
                </div>
            );
        }
    }
}
