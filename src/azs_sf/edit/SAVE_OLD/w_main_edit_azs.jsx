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


export default class w_main_edit_azs extends React.Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
        //this.main_POST_PUT = this.main_POST_PUT.bind(this);
        this.handleResize = this.handleResize.bind(this);



        this.state = {
            list_azs: null,

            curentAZS: null,

            open: false,
            open1: false,

            msg_text: "",

            isCopy: false,

            dataProp: new Array(),

            w_Width: window.innerWidth,
            w_Height: window.innerHeight,

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
                this.setState({ list_azs: Jsons.object.sort(compare_azs_iid), dataProp: Get_Proper_ForTable(Jsons.object[0], true) });
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
    ChooseTableRow = (NewRow) => {
        if (NewRow != null) {
            let _Obj_T = new Array();
            let _Obj_T_M = new Array();
            let i = 0;
            for (const key in NewRow.original) {
                if (!Array.isArray(key)) {
                    _Obj_T[i] = key;
                    i++;
                    if (NewRow.original.hasOwnProperty(key)) {
                        _Obj_T_M[key] = NewRow.original[key];
                    }
                }
            }
            _Obj_T.push(_Obj_T_M);

            this.setState({ curentAZS: NewRow.original, curentAZS_M: _Obj_T, dataProp: Get_Proper_ForTable(NewRow.original, false) });
        } else {
            this.setState({ curentAZS: null, dataProp: Get_Proper_ForTable(this.state.list_azs[0], true) });
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
    open_Copy_Modal(rowInfo) {
        if (rowInfo != null) {
            this.setState({ isCopy: true, open: true });
        }
    }
    async main_Creat(rowInfo, isCopy, event) {
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
                return Jsons.status;
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
        return "false";
    }
    open_Edit_Modal(rowInfo) {
        if (rowInfo != null) {
            this.setState({ isCopy: false, open: true });
        }
        else {
            this.setState({ open: false, curentAZS_M: null, curentAZS: null });
        }
    }
    open_Add_Modal() {
        /*
        let NewAZS = {
            "id":"00000000-0000-0000-0000-000000000000",
            "iid": 777,
            "dispname": "Тестовая АЗК",
            "th_code": 107095,
            "order_num": 6,
            "shortname": "Тест",
            "region_code": 77,
            "region_name": "РН-Москва",
            "address": "Московская обл., Экспертек",
            "telefon": "77777"
        }
        */
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
    close_Modal = () => this.setState({ open: false, curentAZS_M: null, curentAZS: null }, this.componentDidMount);

    close_Modal1 = () => this.setState({ open1: false });

    open_Modal1 = (msg) => this.setState({ open1: true, msg_text: msg });

    render() {

        if (this.state.list_azs != null) {
            let ArCol = new Array();

            let ArCol_Prop = new Array();
            ArCol_Prop[0] = { Header: "Название параметра", accessor: "name", _width: "10%" };//'Название параметра'
            ArCol_Prop[1] = { Header: "Значение параметра", accessor: "value", _width: "90%" };//'Значение параметра'
            //let dataProp = Get_Proper_ForTable(this.state.list_azs[0], true);
            ArCol = Get_ColumnsForTable(this.state.list_azs[0]);

            let w_table_Main = {
                verticalAlign: "top",
                width: "100%",
            }
            let div_Main = {
                height: this.state.w_Height,
                width: this.state.w_Width - 50,
            }
            let w_table_But = {
                verticalAlign: "top",
                maxHeight: "10px",
            }
            let w_td = {
                width: '50%',
                verticalAlign: "top",
            }
            let size = 'large';
            let size1 = 'mini';
            return (
                <div style={div_Main}>
                    <table style={w_table_Main}>
                        <tbody>
                            <tr >
                                <td colSpan='2'>
                                    <ReactTable
                                        data={this.state.list_azs}
                                        columns={[
                                            {
                                                Header: "Список АЗК",
                                                columns: ArCol,

                                            }
                                        ]}
                                        getTrProps={(state, rowInfo, column, instance) => {
                                            return {
                                                onClick: () => {
                                                    this.ChooseTableRow(rowInfo);
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
                            <tr>
                                <td style={w_table_But} height="20px">
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td id='td_button'>
                                                        <button id='_button' onClick={el => { this.open_Add_Modal(el, this.state.curentAZS) }}>добавить</button>
                                                    </td>
                                                    {this.state.curentAZS != null &&
                                                        <>
                                                            <td id='td_button'>
                                                                <button id='_button' onClick={el => { this.open_Copy_Modal(el, this.state.curentAZS) }} >копировать</button>
                                                            </td>

                                                            <td id='td_button'>
                                                                <button id='_button' onClick={el => { this.open_Edit_Modal(el, this.state.curentAZS) }} >редактировать</button>
                                                            </td>
                                                            <td id='td_button'>
                                                                <button id='_button' onClick={el => { this.main_Delete_Modal(el, this.state.curentAZS) }} >удалить</button>
                                                            </td>
                                                        </>
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style={w_td}>
                                    <ReactTable
                                        data={this.state.dataProp}
                                        columns={[
                                            {
                                                Header: "АЗК",
                                                columns: ArCol_Prop,
                                            }
                                        ]}

                                        showPaginationBottom={false}
                                        defaultPageSize={8}
                                        filterable={false}
                                        show={false}
                                        nextText={'>'}
                                        previousText={'<'}
                                        rowsText={'строк'}
                                        //width={150}
                                        pageText={'стр.'}
                                        ofText={'из'}
                                        className="-striped -highlight"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Modal id="ModalTable" size={size} open={this.state.open} onClose={this.close_Modal} closeIcon>
                        <center><Modal.Header>АЗК</Modal.Header></center>
                        <Container>
                            <W_edit_azs onClose={this.close_Modal} main_Creat={this.main_Creat}
                                Data={this.state.curentAZS_M} isCopy={this.state.isCopy} history={this.props.history}
                                open_Modal1={this.open_Modal1}
                            />
                        </Container>
                    </Modal>

                    <Modal id="ModalTable1" size={size1} open={this.state.open1} onClose={this.close_Modal1}>
                        <center><Modal.Header ><input id="_circl_min" type="image" src={'../images/TRK/NoConnection.png'} /></Modal.Header></center>
                        <Modal.Actions>
                            <center>{this.state.msg_text}</center>
                        </Modal.Actions>
                        <Modal.Actions>

                            <center><input id="_button_mes" type="image" src={'../images/Rect_Red.png'} onClick={this.close_Modal1} /></center>
                        </Modal.Actions>
                    </Modal>

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
