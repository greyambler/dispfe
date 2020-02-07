import React from 'react';

import { Element, animateScroll as scroll } from 'react-scroll'

import {
    demoAsyncCall, RSS_List_Main, RSS_AZS,
    Get_FIRST_COLL_Single,
    Get_Main_PROPS_AZS_Single
} from './core/core_Function.jsx'


import W_table_azs from './azs_sf/w_table_azs_new.jsx'

const _Debuge = false;
const _Debuge_Alert = false;

export default class w_AZS_SF_new extends React.Component {
    constructor(props) {
        super(props);
        //this.Get_list_book_row = this.Get_list_book_row.bind(this);
        this.get_Id_Devices = this.get_Id_Devices.bind(this);


        this.View_Modal_Err = this.View_Modal_Err.bind(this);
        this.View_Modal_Ok = this.View_Modal_Ok.bind(this);
        this.state = {
            loading: true,//окно ожидания


            DVC: this.props.DVC,
            list_azs_check: this.props.list_azs_check,
            list_type_dvc: this.props.list_type_dvc,
            list_fuels: this.props.list_fuels,
            list_book_row: this.props.list_book_row,

            //DVC: this.props.DVC,

            //list_type_dvc: this.props.list_type_dvc,
            //list_fuels: this.props.list_fuels,


            //list_azs_check: null,//this.props.list_azs_check,

            //list_book_row: null,
            list_dvc_azs: null,


        }
    }
    componentWillUnmount() {

    }
    /***Modal_Alert *///окно ожидания
    View_Modal_Err(stt) {//окно ожидания
        this.setState({ openModal_Err: stt });
    }
    View_Modal_Ok(stt) {//окно ожидания
        this.setState({ openModal_Ok: stt });
    }
    /***Modal_Alert *///окно ожидания

    componentDidMount() {
        demoAsyncCall().then(() => this.setState({ loading: false }));//окно ожидания

        //this.tick();

        //this.setState({ DVC: this.props.DVC }, this.Get_list_book_row);
        //this.setState({ list_azs_check: this.props.list_azs_check });

        this.get_Id_Devices(this.state.list_azs_check, this.state.list_type_dvc);

    }
    componentDidUpdate(prevProps) {
/*         if (this.props.DVC !== prevProps.DVC) {
            this.setState({ DVC: this.props.DVC }, this.Get_list_book_row)
        }
 */        if (this.props.list_azs_check !== prevProps.list_azs_check) {
            this.setState({ list_azs_check: this.props.list_azs_check }, this.get_Id_Devices);
        }
        if (this.props.visible !== prevProps.visible) {
            this.setState({ visible: this.props.visible });
        }
    }
/*     async tick() {
        let rss = RSS_List_Main;
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
                this.setState({ list_type_dvc: Jsons.dvctyptree, list_fuels: Jsons.fuel }, this.Get_list_book_row);
            }
            else {
                throw Error(response.statusText);
            }
            this.setState({ isExistError: false })
        }
        catch (error) {
            this.setState({ isExistError: true })
            console.log(error);
            if (_Debuge_Alert)
                alert(error);
        }
    }
    Get_list_book_row() { //Первый столбец ()
        if (this.state.list_type_dvc != null && this.state.list_azs_check != null ) {
            let BOOK_All = Get_FIRST_COLL_Single(this.state.list_type_dvc, this.state.DVC);
            this.setState({ list_book_row: BOOK_All });
        }
    }
 */    

 async get_Id_Devices(list_azs_check, list_type_dvc) {
        if (list_azs_check != null && list_type_dvc != null) {
            let M = new Array();
            for (const iterator of list_azs_check) {
                if (iterator.check) {
                    let m = await this.tick_azs_id(RSS_AZS, iterator.id);
                    let mas = Get_Main_PROPS_AZS_Single(iterator, m, list_type_dvc);
                    M.push(mas);
                }
            }
            this.setState({ list_dvc_azs: M });
        }
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

        /***** Ждать *****************/
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
        /***** Ждать *****************/

        if (this.state.list_book_row != null && this.state.list_type_dvc != null
            //&& this.props.list_azs_check != null 
            && this.state.list_dvc_azs != null) {

            return (
                <W_table_azs
                    history={this.props.history}
                    list_fuels={this.state.list_fuels}
                    list_book_row={this.state.list_book_row}
                    list_dvc_azs={this.state.list_dvc_azs}

                    visible={this.props.visible}
                />
            );
        } else {
            let div_Null = {
                //marginLeft: 5,
                minWidth: _Width - 40,
                minHeight: _Height - 70,
            }
            return (
                <div style={div_Null}>
                    <center><h4>{this.props.header}</h4></center>
                    <hr /><hr />
                    <h4><center>Нет связи с сервером!!(w_AZS_SF)</center></h4>
                    <hr width={this.state.w_Width - 50} />
                </div>
            );
        }
    }
}
