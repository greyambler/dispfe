import React from 'react';

import ReactTable from "react-table";
import 'react-table/react-table.css'

import { RSS_AZS_EDIT, set_Curent_Login, createGuid, get_KeyHead, compare_azs_iid } from '../../core/core_Function.jsx'
import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';


import C_azs_edit from './_azs_edit.jsx';

//import C_azs_edit from './edit_azs.jsx';

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

export default class azs_tbl extends React.Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);


        this.state = {

            list_azs: null,
            list_Head: null,

            curentAZS: this.props.curentAZS,

            open: false,
            msg_text: "",
            isCopy: false,

        };
    }
    componentDidMount() {
        this.tick();
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
                });

                let r = 0;
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

    ChooseCurentAZS = (rowInfo) => {
        let _Obj_T = null;
        if (rowInfo != null) {
            _Obj_T = new Array();
            let _Obj_T_M = new Array();
            let i = 0;
            for (const key in rowInfo.original) {
                if (!Array.isArray(key)) {
                    _Obj_T[i] = key;
                    i++;
                    if (rowInfo.original.hasOwnProperty(key)) {
                        _Obj_T_M[key] = rowInfo.original[key];
                    }
                }
            }
            _Obj_T.push(_Obj_T_M);
        }
        this.setState({ curentAZS: rowInfo.original});
        //this.setState({ curentAZS: rowInfo.original, curentAZS_M: _Obj_T });//, this.props.ChooseCurentAZS(rowInfo.original));
    }

    // ROW

    //удаление
    async main_Delete_Modal(rowInfo) {
        if (this.state.curentAZS != null) {
            let _id = this.state.curentAZS.id;
            if (_id) {
                let _s = await this.delet_AZS(_id);
                //alert("Команда получила ответ - " + _s);
                this.setState({ open: false, curentAZS_M: null, curentAZS: null }, this.componentDidMount);
                this.props.ChooseCurentAZS(null);
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
    //добавить
    open_Add_Modal = () => {
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
            this.setState({ isCopy: false, curentAZS: NewAZS.original, curentAZS_M: _Obj_T, open: true }, this.props.ChooseCurentAZS(null));
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
    open_Copy_Modal = (rowInfo) => {
        let r = 0;
        if (rowInfo != null) {
            this.setState({ isCopy: true, open: true });
        }
    }    
    open_Edit_Modal = (rowInfo) => {
        let r = 0;
        if (rowInfo != null) {
            this.setState({ isCopy: false, open: true });
        }
        else {
            this.setState({ open: false, curentAZS_M: null, curentAZS: null });
        }
    }
    close_Modal = (azs) => {
        if (azs != null && azs.id != null) {
            this.setState({ open: false, curentAZS_M: null, curentAZS: azs }, this.componentDidMount);
            this.props.ChooseCurentAZS(azs);
        } else {
            this.setState({ open: false, curentAZS_M: null, curentAZS: null }, this.componentDidMount);
        }
    }

    //ROW


    render() {
        if (this.state.list_azs != null && this.state.list_Head != null) {
            let size = 'large';
            let size1 = 'mini';


            let w_table_Main = {
                verticalAlign: "top",
                width: "100%",
            }
            let w_table_But = {
                verticalAlign: "top",
                maxHeight: "10px",
                height: "20px",
            }


            return (
                <div style={this.props.div_Main}>
                    <table style={w_table_Main}>
                        <tbody>
                            <tr key={createGuid()}>
                                <td style={w_table_But} key={createGuid()}>
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr key={createGuid()}>
                                                    <td key={createGuid()}>
                                                        <button className="ui active mini button" onClick={el => { this.open_Add_Modal(el, this.state.curentAZS) }}>добавить</button>
                                                    </td>
                                                    {this.state.curentAZS != null &&
                                                        <>
                                                            <td key={createGuid()}>
                                                                <button className="ui active mini button" onClick={el => { this.open_Copy_Modal(el, this.state.curentAZS) }} >копировать</button>
                                                            </td>
                                                            <td key={createGuid()}>
                                                                <button className="ui active mini button" onClick={el => { this.open_Edit_Modal(el, this.state.curentAZS) }} >редактировать</button>
                                                            </td>
                                                            <td key={createGuid()}>
                                                                <button className="ui active mini button" onClick={el => { this.main_Delete_Modal(el, this.state.curentAZS) }} >удалить</button>
                                                            </td>
                                                        </>
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            <tr key={createGuid()}>
                                <td key={createGuid()}>
                                    <ReactTable
                                        data={this.state.list_azs}
                                        columns={[
                                            {
                                                Header: "Список АЗС",
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
                        </tbody>
                    </table>


                    {/* Modal редактор*/}
                    <Modal id="ModalTable" size={size1} open={this.state.open} onClose={this.close_Modal} closeIcon>
                        <center><Modal.Header>АЗК</Modal.Header></center>
                        <Container>
                            <C_azs_edit onClose={this.close_Modal} main_Creat={this.main_Creat}
                                Data={this.state.curentAZS_M} isCopy={this.state.isCopy} history={this.props.history}
                                open_Modal1={this.open_Modal1}
                            />
                        </Container>
                    </Modal>
                    {/* Modal редактор*/}

                </div>
            );
        }
        else {
            return (
                <div>
                    <center><h4>{this.props.header}</h4></center>
                    <hr /><hr />
                    <h4><center>Нет данных!!!(w_main_azs)</center></h4>

                </div>
            );
        }

    }
}
