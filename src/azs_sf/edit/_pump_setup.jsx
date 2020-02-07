import React, { Component, PropTypes } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';

import {
    get_Line_AZS, set_Curent_Login, RSS_AZS_EDIT, get_KeyHead, compare_azs_iid,
    Get_Main_PROPS, RSS_List_Main, RSS_AZS, createGuid, Init_DVC, WhatKeyNotShow, get_Line_PL, get_Line_PUMP
} from '../../core/core_Function.jsx';

import C_pump_edit from './_pump_edit.jsx';

function get_ai_Image_Name(_Fuels, el) {

    for (const iterator of _Fuels) {
        if (iterator.id == el.fuel) {
            return iterator.nm;
        }
    }
    return "";
}
function get_ai_Image(_Fuels, el) {
    let name = "";
    let Image = './images/PL/00.png';
    if (_Fuels != null && el != null && el.fuel != null) {
        for (const item of _Fuels) {
            if (item.id == el.fuel) {
                name = item.fu;
                break;
            }
        }
        switch (name) {
            case "ДТ": {
                Image = './images/PL/DT.png'
                break;
            }
            case "98": {
                Image = './images/PL/98.png'
                break;
            }
            case "95": {
                Image = './images/PL/95.png'
                break;
            }
            case "92": {
                Image = './images/PL/92.png'
                break;
            }
            default: {
                Image = './images/PL/00.png'
                break;

            }
        }
    }
    return Image;
}


export default class _pump_setup extends Component {
    constructor(props) {
        super(props);

        //this.tick_fuels = this.tick_fuels.bind(this);
        this.tick_azs_id = this.tick_azs_id.bind(this);

        this.state = {
            curentAZS: this.props.curentAZS,
            curentPL: null,

            _up_ListPL: true,
            _arrow_ListPL: "images/arrow_Up.png",

            //Modal
            open_PL: false,
            isCopy_PL: false,


            list_type_dvc: this.props.list_type_dvc,
            list_fuels: this.props.list_fuels,
            table_PL_curentAZS: null,
        }
    }
    componentDidMount() {
        this.setState({ list_type_dvc: this.props.list_type_dvc, list_fuels: this.props.list_fuels });
    }
    componentDidUpdate(prevProps) {
        if (this.props._up !== prevProps._up) {
            this.setState({ _up: this.props._up });
        }
        if (this.props.curentAZS !== prevProps.curentAZS) {
            this.setState({ curentAZS: this.props.curentAZS , curentPL: null }, this.tick_azs_id);
        }
        if (this.props.list_fuels !== prevProps.list_fuels) {
            this.setState({ list_fuels: this.props.list_fuels });
        }
        if (this.props.list_type_dvc !== prevProps.list_type_dvc) {
            this.setState({ list_type_dvc: this.props.list_type_dvc });
        }
    }



    //PL

    async tick_azs_id() {
        if (this.state.curentAZS != null) {
            let rss = RSS_AZS + '/' + this.state.curentAZS.id;
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
                    if (Jsons.dvc != null) {
                        let Ar = new Array();
                        for (const iterator of Jsons.dvc) {
                            if (iterator.typ == "pump")
                                Ar.push(iterator);
                        }
                        this.set_First_PL_all(Ar);
                    } else {
                        let r = 0;
                    }
                }
                else {
                    throw Error(response.statusText);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    set_First_PL_all = (PL_Ar) => {
        let T_Ar = new Array();
        if (PL_Ar != null) {
            for (const iterator of PL_Ar) {
                T_Ar.push({
                    "img": "./images/TRK.png",
                    "nm": iterator.nm,
                    /* "name": get_ai_Image_Name(this.state.list_fuels, iterator),
                    "fuile_img": get_ai_Image(this.state.list_fuels, iterator),
                    "V": 0, "MaxV": 0,
                    "Vq": 0, "minV": 0, "maxVM": 0 */
                });

            }
        }
        this.setState({ table_PL_curentAZS: T_Ar });
    }
    Show_up_ListPL = () => {
        if (!this.state._up_ListPL) {
            this.setState({ _arrow_ListPL: "images/arrow_Up.png", _up_ListPL: true });
        } else {
            this.setState({ _arrow_ListPL: "images/arrow_Down.png", _up_ListPL: false });
        }
    }
    ChooseCurentPL = (rowInfo) => {
        if (rowInfo != null) {
            this.setState({ curentPL: rowInfo.original });
        } else {
            this.setState({ curentPL: null });
        }
    }

    //кнопки

    //удаление
    async main_Delete_Modal_PL(rowInfo) {
        if (this.state.curentAZS != null) {
            let _id = this.state.curentAZS.id;
            if (_id) {
                //let _s = await this.delet_AZS(_id);
                alert("Команда получила ответ - " + "_s");
                //this.setState({ open_PL: false, curentAZS: null }, this.componentDidMount);

            }
        }
    }
    async delet_PL(OB) {//Удаление azs
        let _body = OB;
        //alert('Отправленное id: ' + _body);
        let rss = RSS_AZS_EDIT + "/" + _body;
        let token = localStorage.tokenData;
        if (token != null) {
            let r = token.indexOf("!^!");
            set_Curent_Login(token.substring(0, r));
            token = token.substring(r + 3);
        }

        var myRequest = new Request(rss);
        try {
            var response = await fetch(myRequest,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': "Bearer" + token,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const Jsons = await response.json();
            if (response.ok) {
                //this.setState({ _ANS: Jsons });
                //alert("Команда получила ответ - " + Jsons.status);
                return Jsons.status;
            }
            else {
                throw Error(Jsons.message);
            }
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
        return "false";
    }
    //добавить
    open_Add_Modal_PL = () => {
        let NewAZS = {
            "id": "00000000-0000-0000-0000-000000000000",
            "nm": "",
            "name": "",
            "V": "",
            "MaxV": "",
            "Vq": "",
            "minV": "",
            "maxVM": ""
        }

        this.setState({ isCopy_PL: false, curentPL: NewAZS, open_PL: true });
    }
    async main_Creat_PL(rowInfo, isCopy, event) {
        let _body = rowInfo;
        let rss = RSS_AZS_EDIT;
        let token = localStorage.tokenData;
        if (token != null) {
            let r = token.indexOf("!^!");
            set_Curent_Login(token.substring(0, r));
            token = token.substring(r + 3);
        }
        var myRequest = new Request(rss);
        event.preventDefault();
        try {
            let _ID = (isCopy) ? "00000000-0000-0000-0000-000000000000" : JSON.parse(_body).id;
            var response = await fetch(myRequest,
                {
                    method: (_ID == "00000000-0000-0000-0000-000000000000") ? 'POST' : 'PUT',
                    headers: {
                        'Authorization': "Bearer" + token,
                        'Content-Type': 'application/json',
                    },
                    body: _body,
                }
            );
            const Jsons = await response.json();
            if (response.ok) {
                return Jsons.object;
                //alert("Команда получила ответ - " + Jsons.status);
            }
            else {
                throw Error(Jsons.message);
            }
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
        return null;
    }
    // копировать
    open_Copy_Modal_PL = (rowInfo) => {
        let r = 0;
        if (rowInfo != null) {
            this.setState({ isCopy_PL: true, open_PL: true });
        }
    }
    open_Edit_Modal_PL = (rowInfo) => {
        let r = 0;
        if (rowInfo != null) {
            this.setState({ isCopy_PL: false, open_PL: true });
        }
        else {
            this.setState({ open_PL: false, curentPL: null });
        }
    }
    close_Modal_PL = (pl) => {
        if (pl != null && pl.id != null) {
            this.setState({ open_PL: false, curentPL: pl }, this.componentDidMount);
            this.ChooseCurentPL(pl);
        } else {
            this.setState({ open_PL: false, curentPL: null }, this.componentDidMount);
        }
    }
    //кнопки

    //PL


    render() {
        if (this.state.curentAZS) {
            let size1 = 'mini';
            let div_Main = {
                width: this.state.w_Width - 45,
            }
            let w_table_Main = {
                transition: '0.2s',
                color: '#000',
                fontSize: '11px',
                width: '100%',
                border: '1px solid #A5ABB3',
                verticalAlign: 'middle',
                alignContent: 'center',
            }
            let style_td = {
                verticalAlign: "top",
                //border: '1px solid #A5ABB3',
                //align: 'center',
                //valign: "top",
            }
            let w_table_But = {
                verticalAlign: "top",
                maxHeight: "10px",
                height: "20px",
                border: '1px solid #A5ABB3',
            }


            return (
                <div style={style_td}>

                    <table style={w_table_Main}>
                        <tbody>
                            {/* PUMP */}

                            {/* Первая строка с выбранным PL */}
                            <tr>
                                <td>
                                    <div>
                                        <table style={w_table_Main}>
                                            <tbody>
                                                <tr key={createGuid()}>
                                                    <td width="20" key={createGuid()} style={style_td}>
                                                        <img src={this.state._arrow_ListPL} className="ui mini center aligned image" onClick={this.Show_up_ListPL} />
                                                    </td>
                                                    <td key={createGuid()} style={style_td}>
                                                        {get_Line_PUMP(this.state.curentPL)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            {this.state.curentAZS != null && /* Строка с кнопками PL*/
                                <tr key={createGuid()}>
                                    <td style={w_table_But} key={createGuid()}>
                                        <div>
                                            <table>
                                                <tbody>
                                                    <tr key={createGuid()}>
                                                        <td key={createGuid()}>
                                                            <button className="ui active mini button" onClick={el => { this.open_Add_Modal_PL(el, this.state.curentPL) }}>добавить</button>
                                                        </td>
                                                        {this.state.curentPL != null &&
                                                            <>
                                                                <td key={createGuid()}>
                                                                    <button className="ui active mini button" onClick={el => { this.open_Copy_Modal_PL(el, this.state.curentPL) }} >копировать</button>
                                                                </td>
                                                                <td key={createGuid()}>
                                                                    <button className="ui active mini button" onClick={el => { this.open_Edit_Modal_PL(el, this.state.curentPL) }} >редактировать</button>
                                                                </td>
                                                                <td key={createGuid()}>
                                                                    <button className="ui active mini button" onClick={el => { this.main_Delete_Modal_PL(el, this.state.curentPL) }} >удалить</button>
                                                                </td>
                                                            </>
                                                        }
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {this.state.table_PL_curentAZS != null && this.state.curentAZS != null && this.state._up_ListPL && /* Таблица с PL*/
                                <tr>
                                    <td>
                                        <ReactTable
                                            data={this.state.table_PL_curentAZS}
                                            columns={[
                                                {
                                                    Header: 'вид',
                                                    accessor: 'img',
                                                    Cell: props => <img src={props.value} title={props.value} className="ui mini center aligned image" />,
                                                },
                                                {
                                                    Header: 'ТРК',
                                                    accessor: 'nm'
                                                },
                                            ]}

                                            getTrProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    onClick: () => {
                                                        this.ChooseCurentPL(rowInfo);
                                                    }
                                                }
                                            }}

                                            defaultPageSize={5}
                                            filterable={false}
                                            show={false}
                                            showPageSizeOptions={false}
                                            pageSizeOptions={[5, 10,]}
                                            nextText={'>'}
                                            previousText={'<'}
                                            rowsText={'строк'}
                                            width={110}
                                            pageText={'стр.'}
                                            ofText={'из'}
                                            className="-striped -highlight"

                                        />
                                    </td>
                                </tr>
                            }


                        </tbody>
                    </table>



                    {/* Modal редактор АЗС */}
                    <Modal id="ModalTable" size={size1} open={this.state.open_PL} onClose={this.close_Modal_PL} closeIcon >
                        <center><Modal.Header>ТРК</Modal.Header></center>
                        <Container>
                            <C_pump_edit onClose={this.close_Modal_PL} main_Creat={this.main_Creat_PL}
                                Data={this.state.curentPL} isCopy={this.state.isCopy_PL} history={this.props.history}
                                open_Modal1={this.open_Modal1}
                            />
                        </Container>
                    </Modal>
                    {/* Modal редактор АЗС */}


                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}