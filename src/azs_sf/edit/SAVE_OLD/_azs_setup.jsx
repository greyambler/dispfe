import React, { Component, PropTypes } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

import {
    get_Line_AZS, set_Curent_Login, RSS_AZS_EDIT, get_KeyHead, compare_azs_iid,
    Get_Main_PROPS, RSS_List_Main, RSS_AZS, createGuid, Init_DVC, WhatKeyNotShow, get_Line_PL
} from '../../core/core_Function.jsx';

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
export default class _azs_setup extends Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
        this.state = {
            _up: this.props._up,
            curentAZS: this.props.curentAZS,
            list_azs: null,
            list_Head: null,
        }
    }

    componentDidMount() {
        this.tick();
    }
    componentDidUpdate(prevProps) {
        if (this.props._up !== prevProps._up) {
            this.setState({ _up: this.props._up }, this.tick());
        }
        if (this.props.curentAZS !== prevProps.curentAZS) {
            this.setState({ curentAZS: this.props.curentAZS });
        }
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
    Show_up_ListAZS = () => {
        if (!this.state._up_ListAZS) {
            this.setState({ _arrow_ListAZS: "images/arrow_Up.png", _up_ListAZS: true });
        } else {
            this.setState({ _arrow_ListAZS: "images/arrow_Down.png", _up_ListAZS: false });
        }
    }
    ChooseCurentAZS = (rowInfo) => {
        if (rowInfo != null) {
            this.props.ChooseCurentAZS(rowInfo.original);
        }
    }

    render() {
        if (this.state._up) {
            let style_td = {
                width: "100%",
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
                    <table style={w_table_Main}>
                        <tbody>
                            {this.state.list_azs != null &&
                                <tr>
                                    <td colSpan="6">
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
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}