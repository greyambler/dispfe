import React from 'react';

import ReactTable from "react-table";
import 'react-table/react-table.css'

import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';
import {
    get_Line_AZS, set_Curent_Login, RSS_AZS_EDIT, get_KeyHead, compare_azs_iid,
    Get_Main_PROPS, RSS_List_Main, RSS_AZS, createGuid, Init_DVC, WhatKeyNotShow, get_Line_PL
} from '../../core/core_Function.jsx';


//import C_azs_tbl from './_azs_tbl.jsx';
//import C_azs_pl from './_azs_pl.jsx';

import C_azs_edit from './_azs_edit.jsx';
import C_pl_edit from './_pl_edit.jsx';


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
function get_Coll() {
    let Col = new Array();
    Col.push({ Header: "Иконка", accessor: "img" });
    Col.push({ Header: "Резервуары", accessor: "nm" });
    Col.push({ Header: "Вид топлива", accessor: "name" });
    Col.push({ Header: "Топлива", accessor: "fuile_img" });
    Col.push({ Header: "Объем, л", accessor: "V" });
    Col.push({ Header: "Максимальный объём, л", accessor: "MaxV" });
    Col.push({ Header: "Объём для заказа, л", accessor: "Vq" });
    Col.push({ Header: "Минимальный объём, л", accessor: "minV" });
    Col.push({ Header: "Максимальный объём подтоварной воды, л", accessor: "maxVM" });
    return Col;
}
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

export default class w_main_azs extends React.Component {
    constructor(props) {
        super(props);

        this.handleResize = this.handleResize.bind(this);

        this.tick = this.tick.bind(this);
        this.tick_fuels = this.tick_fuels.bind(this);
        this.tick_azs_id = this.tick_azs_id.bind(this);


        this.state = {
            w_Width: window.innerWidth,

            curentAZS: null,
            curentPL: null,

            _up_ListAZS: true,
            _arrow_ListAZS: "images/arrow_Up.png",

            _up_ListPL: true,
            _arrow_ListPL: "images/arrow_Up.png",

            //Modal
            open_AZS: false,
            msg_text: "",
            isCopy_AZS: false,

            open_PL: false,
            isCopy_PL:false,


            list_type_dvc: null,
            list_fuels: null,
            list_need_DVC: Init_DVC(),

            //list_PL_curentAZS: null,
            table_PL_curentAZS: null,

        };
    }

    handleResize() {
        this.setState({ w_Width: window.innerWidth, w_Height: window.innerHeight })
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.tick();
        this.tick_fuels();
    }

    //azs

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
    Show_up_ListAZS = () => {
        if (!this.state._up_ListAZS) {
            this.setState({ _arrow_ListAZS: "images/arrow_Up.png", _up_ListAZS: true });
        } else {
            this.setState({ _arrow_ListAZS: "images/arrow_Down.png", _up_ListAZS: false });
        }
    }
    ChooseCurentAZS = (rowInfo) => {
        if (rowInfo != null) {
            this.setState({ curentAZS: rowInfo.original, curentPL: null }, this.tick_azs_id);
        }
    }
    //кнопки

    //удаление
    async main_Delete_Modal_AZS(rowInfo) {
        if (this.state.curentAZS != null) {
            let _id = this.state.curentAZS.id;
            if (_id) {
                let _s = await this.delet_AZS(_id);
                //alert("Команда получила ответ - " + _s);
                this.setState({ open_AZS: false, curentAZS: null }, this.componentDidMount);

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
    open_Add_Modal_AZS = () => {
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
        this.setState({ isCopy_AZS: false, curentAZS: NewAZS, open_AZS: true });
    }
    async main_Creat_AZS(rowInfo, isCopy, event) {
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
    open_Copy_Modal_AZS = (rowInfo) => {
        let r = 0;
        if (rowInfo != null) {
            this.setState({ isCopy_AZS: true, open_AZS: true });
        }
    }
    open_Edit_Modal_AZS = (rowInfo) => {
        let r = 0;
        if (rowInfo != null) {
            this.setState({ isCopy_AZS: false, open_AZS: true });
        }
        else {
            this.setState({ open_AZS: false, curentAZS: null });
        }
    }
    close_Modal_AZS = (azs) => {
        if (azs != null && azs.id != null) {
            this.setState({ open_AZS: false, curentAZS: azs }, this.componentDidMount);
            this.ChooseCurentAZS(azs);
        } else {
            this.setState({ open_AZS: false, curentAZS: null }, this.componentDidMount);
        }
    }
    //кнопки

    //azs



    //PL
    async tick_fuels() { //справочники --(топливо)
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
                this.setState({ list_type_dvc: Jsons.dvctyptree, list_fuels: Jsons.fuel });
            }
            else {
                throw Error(response.statusText);
            }
            this.setState({ isExistError: false })
        }
        catch (error) {
            this.setState({ isExistError: true })
            console.log(error);
/*             if (_Debuge_Alert)
                alert(error);
 */        }
    }

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
                            if (iterator.typ == "pl")
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
    /*     set_First_PL = () => {
            let PL = new Array();
            PL.push({ nm: "./images/pl.png", type: "img" });
            PL.push({ nm: "Резервуары", type: "nm" });
            PL.push({ nm: "Вид топлива", type: "name" });
            PL.push({ nm: "Вид топлива", type: "fuile_img" });
            PL.push({ nm: "Объем, л", type: "V" });
            PL.push({ nm: "Максимальный объём, л", type: "MaxV" });
            PL.push({ nm: "Объём для заказа, л", type: "Vq" });
            PL.push({ nm: "Минимальный объём, л", type: "minV" });
            PL.push({ nm: "Максимальный объём подтоварной воды, л", type: "maxVM" });
            return PL;
        }
     */
    set_First_PL_all = (PL_Ar) => {
        //let Ar = new Array();
        let T_Ar = new Array();
        //Ar.push(this.set_First_PL());
        if (PL_Ar != null) {
            for (const iterator of PL_Ar) {
                /* 
                                let PL = new Array();
                                PL.push({ nm: "./images/PL/PL0.png", type: "img" });
                                PL.push({ nm: iterator.nm, type: "nm" });
                                PL.push({ nm: get_ai_Image_Name(this.state.list_fuels, iterator), type: "name" });
                                PL.push({ nm: get_ai_Image_Name(this.state.list_fuels, iterator), type: "fuile_img" });
                                PL.push({ nm: "0", type: "V" });
                                PL.push({ nm: "0", type: "MaxV" });
                                PL.push({ nm: "0", type: "Vq" });
                                PL.push({ nm: "0", type: "minV" });
                                PL.push({ nm: "0", type: "maxVM" });
                
                                Ar.push(PL); */

                T_Ar.push({
                    "img": "./images/PL/PL0.png",
                    "nm": iterator.nm,
                    "name": get_ai_Image_Name(this.state.list_fuels, iterator),
                    "fuile_img": get_ai_Image(this.state.list_fuels, iterator),
                    "V": 0, "MaxV": 0,
                    "Vq": 0, "minV": 0, "maxVM": 0
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
                this.setState({ open_PL: false, curentAZS: null }, this.componentDidMount);

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
            <div style={div_Main}>
                <table style={w_table_Main}>
                    <tbody>

                        <tr><th><h4>Конфигуратор АЗС</h4></th></tr>

                        {/* АЗС */}

                        {/* Первая строка с выбранным АЗС */}
                        <tr>
                            <td>
                                <div>
                                    <table style={w_table_Main}>
                                        <tbody>
                                            <tr key={createGuid()}>
                                                <td width="20" key={createGuid()} style={style_td}>
                                                    <img src={this.state._arrow_ListAZS} className="ui mini center aligned image" onClick={this.Show_up_ListAZS} />
                                                </td>
                                                <td key={createGuid()} style={style_td}>
                                                    {get_Line_AZS(this.state.curentAZS)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        {/* Строка с кнопками АЗС*/}
                        {this.state._up_ListAZS &&
                            <tr key={createGuid()}>
                                <td style={w_table_But} key={createGuid()}>
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr key={createGuid()}>
                                                    <td key={createGuid()}>
                                                        <button className="ui active mini button" onClick={el => { this.open_Add_Modal_AZS(el, this.state.curentAZS) }}>добавить</button>
                                                    </td>
                                                    {this.state.curentAZS != null &&
                                                        <>
                                                            <td key={createGuid()}>
                                                                <button className="ui active mini button" onClick={el => { this.open_Copy_Modal_AZS(el, this.state.curentAZS) }} >копировать</button>
                                                            </td>
                                                            <td key={createGuid()}>
                                                                <button className="ui active mini button" onClick={el => { this.open_Edit_Modal_AZS(el, this.state.curentAZS) }} >редактировать</button>
                                                            </td>
                                                            <td key={createGuid()}>
                                                                <button className="ui active mini button" onClick={el => { this.main_Delete_Modal_AZS(el, this.state.curentAZS) }} >удалить</button>
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

                        {/* Таблица с АЗС */}
                        {this.state._up_ListAZS &&
                            <tr>
                                <td>
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
                        }

                        {/* PL */}

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
                                                    {get_Line_PL(this.state.curentPL)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        {this.state.curentAZS != null && this.state._up_ListPL &&/* Строка с кнопками PL*/
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
                                                Header: '',
                                                accessor: 'img',
                                                Cell: props => <img src={props.value} title={props.value} className="ui mini center aligned image" />,
                                            },
                                            {
                                                Header: 'Резервуары',
                                                accessor: 'nm'
                                            },
                                            {
                                                Header: 'Вид топлива',
                                                accessor: 'fuile_img',
                                                Cell: props => <img src={props.value} title={props.value} className="ui mini center aligned image" />
                                            },
                                            {
                                                Header: 'Объем, л',
                                                accessor: 'V'
                                            },
                                            {
                                                Header: 'Максимальный объём, л',
                                                accessor: 'MaxV'
                                            },
                                            {
                                                Header: 'Объём для заказа, л',
                                                accessor: 'Vq'
                                            },
                                            {
                                                Header: 'Максимальный объём подтоварной воды, л',
                                                accessor: 'maxVM'
                                            },
                                            {
                                                Header: 'Минимальный объём, л',
                                                accessor: 'minV'
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
                <Modal id="ModalTable" size={size1} open={this.state.open_AZS} onClose={this.close_Modal_AZS} closeIcon >
                    <center><Modal.Header>АЗК</Modal.Header></center>
                    <Container>
                        <C_azs_edit onClose={this.close_Modal_AZS} main_Creat={this.main_Creat_AZS}
                            Data={this.state.curentAZS} isCopy={this.state.isCopy_AZS} history={this.props.history}
                            open_Modal1={this.open_Modal1}
                        />
                    </Container>
                </Modal>
                {/* Modal редактор АЗС */}



                {/* Modal редактор АЗС */}
                <Modal id="ModalTable" size={size1} open={this.state.open_PL} onClose={this.close_Modal_PL} closeIcon >
                    <center><Modal.Header>Резервуар</Modal.Header></center>
                    <Container>
                        <C_pl_edit onClose={this.close_Modal_PL} main_Creat={this.main_Creat_PL}
                            Data={this.state.curentPL} isCopy={this.state.isCopy_PL} history={this.props.history}
                            open_Modal1={this.open_Modal1}
                        />
                    </Container>
                </Modal>
                {/* Modal редактор АЗС */}

            </div>
        );
    }
}
