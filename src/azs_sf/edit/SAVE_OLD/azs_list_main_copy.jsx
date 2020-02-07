import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

import { RSS_AZS_EDIT, set_Curent_Login, createGuid, get_KeyHead, compare_azs_iid } from '../../core/core_Function.jsx'
import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';

import W_edit_azs from './edit_azs.jsx';

const _Debuge = false;


function Get_ColumnsForTable(F_Item) {
    let ArCol = new Array();
    let t = 0;
    let KeyHead = '';
    if (F_Item != null) {
        for (var key in F_Item) {
            if (key != "id")// && key != "iid") 
            {
                KeyHead = get_KeyHead(key);
                ArCol[t] = { Header: KeyHead, accessor: key };
                t++;
            }
        }
    }
    return ArCol;
}
function Get_Proper_ForTable(F_Item, is_Null) {
    let ArCol = new Array();
    if (F_Item != null) {
        for (var key in F_Item) {
            if (key != "id")// && key != "iid") 
            {
                if (!is_Null) {
                    ArCol.push({ name: get_KeyHead(key), value: F_Item[key] });//'Название параметра'
                } else {
                    ArCol.push({ name: get_KeyHead(key), value: "" });
                }
            }
        }
    }
    return ArCol;
}
function get_Line_AZS(_Item) {

    return "Выбрано - " + _Item.iid + ", " +
        _Item.dispname + ", " +
        _Item.th_code + ", " +
        _Item.order_num + ", " +
        _Item.shortname + ", " +
        _Item.region_code + ", " +
        _Item.region_name + ", " +
        _Item.address + ", " +
        _Item.telefon;
}

export default class azs_list_main extends React.Component {
    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.ChooseCurentAZS = this.ChooseCurentAZS.bind(this);
        this.Tr_Click = this.Tr_Click.bind(this);
        this.open_Add_Modal = this.open_Add_Modal.bind(this);

        this.state = {
            w_Width: window.innerWidth,
            w_Height: window.innerHeight,

            list_azs: null,
            list_Head: null,
            _up: true,
            //_arrow: this.props.UP ? "images/arrow_Up.png" : "images/arrow_Down.png",
            _arrow: "images/arrow_Up.png",




            curentAZS: null,

            is_AddEdit_AZS: null,

            dataProp: new Array(),


        };
    }
    handleResize() {
        this.setState({ w_Width: window.innerWidth, w_Height: window.innerHeight })
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }
    componentDidMount() {
        this.tick();
        window.addEventListener("resize", this.handleResize);
    }
    async tick() {
        let rss = RSS_AZS_EDIT;
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
                    method: 'GET',
                    headers:
                    {
                        'Authorization': "Bearer" + token,
                        'Accept': 'application/json'
                    },
                }
            );
            const Jsons = await response.json();
            if (response.ok) {
                this.setState({
                    list_azs: Jsons.object.sort(compare_azs_iid),
                    list_Head: Get_ColumnsForTable(Jsons.object[0])
                });//, dataProp: Get_Proper_ForTable(Jsons.object[0], true) });
            }
            else {
                throw Error(response.statusText);
            }
        }
        catch (error) {
            this.setState({ isExistError: true })
            alert(error);
            console.log(error);
        }
    }
    Tr_Click() {
        let _UP = !this.state._up;
        if (_UP) {
            this.setState({ _arrow: "images/arrow_Up.png", _up: true });
        } else {
            this.setState({ _arrow: "images/arrow_Down.png", _up: false });
        }
        //this.props.setFilter(_UP, this.state.type);
    }
    open_Add_Modal() {
        let NewAZS = {
            "id": "00000000-0000-0000-0000-000000000000",
            "iid": 0,
            "dispname": "",
            "th_code": 0,
            "order_num": 0,
            "shortname": "",
            "region_code": 0,
            "region_name": "",
            "address": "",
            "telefon": ""
        }


        if (NewAZS != null) {
            let _Obj_T = new Array();
            let _Obj_T_M = new Array();
            let i = 0;
            for (const key in NewAZS) {
                if (!Array.isArray(key)) {
                    _Obj_T[i] = key;
                    i++;
                    if (NewAZS.hasOwnProperty(key)) {
                        _Obj_T_M[key] = NewAZS[key];
                    }
                }
            }
            _Obj_T.push(_Obj_T_M);
            this.setState({ isCopy: false, curentAZS: NewAZS.original, curentAZS_M: _Obj_T, open: true });
        }
    }

    open_Copy_Modal(rowInfo) {
        if (rowInfo != null) {
            this.setState({ isCopy: true, open: true });
        }
    }
    open_Edit_Modal(rowInfo) {
        if (rowInfo != null) {
            this.setState({ isCopy: false, open: true });
        }
        else {
            this.setState({ open: false, curentAZS_M: null, curentAZS: null });
        }
    }
    async main_Delete_Modal(rowInfo) {
        if (this.state.curentAZS_M != null) {
            let _id = this.state.curentAZS_M[this.state.curentAZS_M.length - 1].id;
            if (_id) {
                let _s = await this.delet_AZS(_id);
                //alert("Команда получила ответ - " + _s);
                this.setState({ open: false, curentAZS_M: null, curentAZS: null }, this.tick);

            }
        }
    }
    async delet_AZS(OB) {//Удаление azs
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


    ChooseCurentAZS(RowTable) {
        if (RowTable != null) {
            this.setState({ curentAZS: RowTable.original });
        } else {
            this.setState({ curentAZS: null });
        }
    }
    render() {

        if (this.state.list_azs != null && this.state.list_Head != null) {
            let w_table_Main = {
                verticalAlign: "top",
                width: "100%",
            }
            let div_Main = {
                height: this.state.w_Height,
                width: this.state.w_Width - 30,
                //marginRight: '25px',
            }
            //                                {this.state.curentAZS != null &&


            return (
                <div style={div_Main}>
                    <table style={w_table_Main}>
                        <tbody>
                            <tr>
                                <td width="30">
                                    <Image src={this.state._arrow} onClick={this.Tr_Click} />
                                </td>
                                <td width="125">
                                    <button id='_button' onClick={el => { this.open_Add_Modal(el, this.state.curentAZS) }}>добавить</button>
                                </td>
                                {this.state.curentAZS != null &&
                                    <td width="125">
                                        <button id='_button' onClick={el => { this.open_Copy_Modal(el, this.state.curentAZS) }} >копировать</button>
                                    </td>
                                }
                                {this.state.curentAZS != null &&
                                    <td width="125">
                                        <button id='_button' onClick={el => { this.open_Edit_Modal(el, this.state.curentAZS) }} >редактировать</button>
                                    </td>
                                }
                                {this.state.curentAZS != null &&
                                    <td width="125">
                                        <button id='_button' onClick={el => { this.main_Delete_Modal(el, this.state.curentAZS) }} >удалить</button>
                                    </td>
                                }
                                <td/>
                            </tr>
                            {this.state._up &&
                                <tr>
                                    <td colSpan="6">
                                        <ReactTable
                                            data={this.state.list_azs}
                                            columns={[
                                                {
                                                    Header: "Список АЗК",
                                                    columns: this.state.list_Head,
                                                }
                                            ]}
                                            getTrProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    onClick: () => {
                                                        this.ChooseCurentAZS(rowInfo);
                                                    }
                                                }
                                            }}
                                            defaultPageSize={5}
                                            filterable={true}
                                            show={false}
                                            nextText={'>'}
                                            previousText={'<'}
                                            rowsText={'строк'}
                                            width={150}
                                            pageText={'стр.'}
                                            ofText={'из'}
                                            className="-striped -highlight"
                                        />
                                    </td>
                                </tr>
                            }
                            {this.state.curentAZS != null &&
                                <tr>
                                    <td colSpan="6">{get_Line_AZS(this.state.curentAZS)}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            );
        } else {
            let div_Null_Data = {
                minHeight: this.state.w_Height,
                minWidth: this.state.w_Width,
            }
            return (
                <div style={div_Null_Data}>
                    <center><h4>{this.props.header}</h4></center>
                    <hr /><hr />
                    <h4><center>Нет данных!!!(w_main_azs)</center></h4>
                    <hr width={this.state.w_Width - 30} />
                </div>
            );
        }
    }
}
