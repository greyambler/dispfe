import React from 'react';

import ReactTable from "react-table";
import 'react-table/react-table.css'

import { createGuid, get_KeyHead, RSS_List_Main, RSS_AZS, Init_DVC, get_Line_PL } from '../../core/core_Function.jsx'

import W_azs_coll_pl from './_azs_coll_pl.jsx'
import W_azs_coll_pls from './_azs_coll_pls.jsx'


function get_Coll() {
    let Col = new Array();
    //Col.push({ Header: "Иконка", accessor: "img" });
    Col.push({ Header: "Резервуары", accessor: "nm" });
    Col.push({ Header: "Вид топлива", accessor: "name" });
    Col.push({ Header: "Объем, л", accessor: "V" });
    Col.push({ Header: "Максимальный объём, л", accessor: "MaxV" });
    Col.push({ Header: "Объём для заказа, л", accessor: "Vq" });
    Col.push({ Header: "Минимальный объём, л", accessor: "minV" });
    Col.push({ Header: "Максимальный объём подтоварной воды, л", accessor: "maxVM" });
    return Col;
}


function get_ai_Image(_Fuels, el) {

    for (const iterator of _Fuels) {
        if (iterator.id == el) {
            return iterator.nm;
        }
    }
    return "";
}

export default class azs_pl extends React.Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
        this.tick_azs_id = this.tick_azs_id.bind(this);
        this.state = {
            curentAZS: null,

            curent_PL: null,

            _up_PL: true,
            _arrow_PL: "images/arrow_Down.png",

            list_type_dvc: null,
            list_fuels: null,
            list_need_DVC: Init_DVC(),

            list_PL_curentAZS: this.set_First_PL_all(),

            table_PL_curentAZS: new Array(),
        };
    }
    componentDidMount() {
        this.setState({ curentAZS: this.props.curentAZS, curent_PL: null }, this.tick_azs_id);
        this.tick();
    }
    componentDidUpdate(prevProps) {
        if (this.props.curentAZS !== prevProps.curentAZS) {
            this.setState({ curentAZS: this.props.curentAZS, curent_PL: null }, this.tick_azs_id);
        }
    }

    ChooseCurentPL = (rowInfo) => {
        if (rowInfo != null) {
            this.setState({ curent_PL: rowInfo.original });
        } else {
            this.setState({ curent_PL: null });
        }
    }


    Show_up_PL = () => {
        if (!this.state._up_PL) {
            this.setState({ _arrow_PL: "images/arrow_Up.png", _up_PL: true });
        } else {
            this.setState({ _arrow_PL: "images/arrow_Down.png", _up_PL: false });
        }
    }
    set_First_PL = () => {
        let PL = new Array();
        PL.push({ nm: "./images/pl.png", type: "img" });
        PL.push({ nm: "Резервуары", type: "nm" });
        PL.push({ nm: "Вид топлива", type: "name" });
        PL.push({ nm: "Объем, л", type: "V" });
        PL.push({ nm: "Максимальный объём, л", type: "MaxV" });
        PL.push({ nm: "Объём для заказа, л", type: "Vq" });
        PL.push({ nm: "Минимальный объём, л", type: "minV" });
        PL.push({ nm: "Максимальный объём подтоварной воды, л", type: "maxVM" });
        return PL;
    }

    set_First_PL_all = (PL_Ar) => {
        let Ar = new Array();
        let T_Ar = new Array();
        Ar.push(this.set_First_PL());
        if (PL_Ar != null) {
            for (const iterator of PL_Ar) {

                let PL = new Array();
                PL.push({ nm: "images/PL/pl0.png", type: "img" });
                PL.push({ nm: iterator.nm, type: "nm" });
                PL.push({ nm: get_ai_Image(this.state.list_fuels, iterator.fuel), type: "name" });
                PL.push({ nm: "0", type: "V" });
                PL.push({ nm: "0", type: "MaxV" });
                PL.push({ nm: "0", type: "Vq" });
                PL.push({ nm: "0", type: "minV" });
                PL.push({ nm: "0", type: "maxVM" });

                Ar.push(PL);

                T_Ar.push({
                    //"img": "images/PL/pl0.png", 
                    "nm": iterator.nm,
                    "name": get_ai_Image(this.state.list_fuels, iterator.fuel), "V": 0, "MaxV": 0,
                    "Vq": 0, "minV": 0, "maxVM": 0
                });

            }
        }
        this.setState({ list_PL_curentAZS: Ar, table_PL_curentAZS: T_Ar });
    }


    async tick() { //справочники --(топливо)
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


    get_Columns_Name = (F_Item) => {
        let ArCol = new Array();
        let t = 0;
        let KeyHead = '';
        for (var key in F_Item) {
            KeyHead = key;
            ArCol[t] = { Header: F_Item[key], accessor: key };
            t++;
        }
        return ArCol;
    }

    //pl
    //добавить
    open_Add_Modal = () => {
        alert(window.location.host);
    }
    //pl


    render() {
        let style_th = {
            background: 'white',
            minWidth: '140px',
            width: '100%',
            maxWidth: '140px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #A5ABB3',
            align: "center",
            height: '20px',

        }
        let style_td_img = {
            background: 'white',
            minWidth: '20px',
            //width: '120px',
            maxWidth: '40px',
            textAlign: 'center',
            bgcolor: "black",
            //border: '1px solid #A5ABB3',
            align: "center",
            height: '10px',
            verticalAlign: 'top',

        }
        let style_td = {
            background: 'white',
            minWidth: '20px',
            //width: '120px',
            maxWidth: '40px',
            textAlign: 'center',
            bgcolor: "black",
            //border: '1px solid #A5ABB3',
            align: "center",
            height: '10px',
            verticalAlign: 'top',

        }

        let w_table_Main = {
            verticalAlign: "top",
            width: "100%",
        }

        return (
            <div>
                <table style={w_table_Main}>
                    <tbody>
                        <tr>
                            <td>
                                {get_Line_PL(this.state.curent_PL)}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ReactTable
                                    data={this.state.table_PL_curentAZS}
                                    columns={[
                                        {
                                            Header: "Список PL",
                                            columns: get_Coll(),
                                        }
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
                    </tbody>
                </table>

                <table style={w_table_Main}>
                    <tbody>
                        <tr>
                            <td style={style_td} width="20">
                                <center>
                                    <img src={this.state._arrow_PL} className="ui mini center aligned image" onClick={this.Show_up_PL} />
                                </center>
                            </td>
                            <td style={style_td}></td>
                        </tr>


                        <tr>
                            <td colSpan="2">
                                <>
                                    {this.state.curentAZS != null &&
                                        <table style={style_th}>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <W_azs_coll_pls _up_row={this.state._up_PL} list_pl={this.state.list_PL_curentAZS} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    }
                                </>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            </td>
                            <td>
                                <div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <button className="ui active mini button" onClick={el => { this.open_Add_Modal(el, this.state.curentAZS) }}>добавить</button>
                                                </td>
                                                {this.state.curent_PL != null &&
                                                    <>
                                                        <td>
                                                            <button className="ui active mini button" >копировать</button>
                                                        </td>
                                                        <td>
                                                            <button className="ui active mini button" >редактировать</button>
                                                        </td>
                                                        <td>
                                                            <button className="ui active mini button" >удалить</button>
                                                        </td>
                                                    </>
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        );

    }
}
