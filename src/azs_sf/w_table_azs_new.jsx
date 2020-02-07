import React from 'react';

import { demoAsyncCall, createGuid, WhatKeyNotShow, getColor_Crit } from '../core/core_Function.jsx'

//import Single_Coll from './single_coll.jsx'
import Single_Coll from './single_coll_new.jsx'
import Two_Coll from './two_coll_new.jsx'

const _Debuge = false;


function Get_ID_DVC(el_azsS, el_azs, el2) {//(azsS, el) {
    let ar = null;
    if (el_azs.key_value == "ТСО2 на АЗС1") {
        let r = 0;
    }

    if (el_azs != null && el_azs.dvc_id != null && el_azs.dvc_id.toString().length >= 36) {
        if (el_azsS != null) {
            ar = new Array();
            ar.push(el_azs.dvc_id);
            for (const iterator of el_azsS) {
                if (iterator.dvc_id != null && iterator.dvc_id.toString().length >= 36 && iterator.ID == el_azs.ID) {
                    if (!Is_Exist(ar, iterator.dvc_id)) {
                        ar.push(iterator.dvc_id);
                    }
                }
            }
        }
    }
    return ar;
}
function Is_Exist(ar, dvc_id) {
    let exist = false;
    for (const iterator of ar) {
        if (iterator == dvc_id) {
            exist = true;
            break;
        }
    }
    return exist;
}




export default class w_table_azs_new extends React.Component {
    constructor(props) {
        super(props);
        this.setFilter = this.setFilter.bind(this);
        this.get_Up = this.get_Up.bind(this);
        this.isShow_Row_Type = this.isShow_Row_Type.bind(this);

        this.state = {

            history: null,
            list_fuels: null,
            list_book_row: this.props.list_book_row,
            list_dvc_azs: this.props.list_dvc_azs,

            isPL_View: false,
            isPUMP_View: false,
            isTSO_View: false,
        }
    }

    componentDidMount() {
        this.setState({ history: this.props.history });
        this.setState({ list_fuels: this.props.list_fuels });
        this.setState({ list_book_row: this.props.list_book_row });
        this.setState({ list_dvc_azs: this.props.list_dvc_azs });



    }
    componentDidUpdate(prevProps) {
        if (this.props.history != prevProps.history) {
            this.setState({ history: this.props.history });
        }
        if (this.props.list_fuels != prevProps.list_fuels) {
            this.setState({ list_fuels: this.props.list_fuels });
        }
        if (this.props.list_book_row != prevProps.list_book_row) {
            this.setState({ list_book_row: this.props.list_book_row });
        }
        if (this.props.list_dvc_azs != prevProps.list_dvc_azs) {
            this.setState({ list_dvc_azs: this.props.list_dvc_azs });
        }
    }


    setFilter(isView, type) {
        switch (type) {
            case "pl": { this.setState({ isPL_View: isView }); break; }
            case "pump": { this.setState({ isPUMP_View: isView }); break; }
            case "tso": { this.setState({ isTSO_View: isView }); break; }
        }
    }
    get_Up(el) {
        let isView = true;
        switch (el.main_type) {
            case "pl": {
                isView = this.state.isPL_View;
                break;
            }
            case "pump": {
                isView = this.state.isPUMP_View;
                break;
            }
            case "fr":
            case "cash":
            case "td":
            case "msc":
            case "tso": {
                isView = this.state.isTSO_View;
                break;
            }
            default: {
                isView = true;
                break;
            }
        }
        return isView;
    }
    isShow_Row_Type(el) {
        let isView = true;
        switch (el.main_type) {
            case "pl": {
                if (el.ID == 0 && el.key == "nm") {
                    isView = true;
                } else {
                    isView = this.state.isPL_View;
                }
                break;
            }
            case "pump": {
                if (el.ID == 0 && el.key == "nm") {
                    isView = true;
                } else {
                    isView = this.state.isPUMP_View;
                }
                break;
            }
            case "fr":
            case "cash":
            case "td":
            case "msc":
            case "tso": {
                if (el.ID == 0 && el.key == "nm" //&& (el.type == "tso" || el.type == "fr" || el.type == "msc" || el.type == "cash")
                ) {
                    isView = true;
                } else {
                    isView = this.state.isTSO_View;
                }
                break;
            }
            default: {
                isView = true;
                break;
            }
        }
        return isView;
    }
    render() {
        let w_table_Main = {
            background: "#F0F0F0",

        }
        let style_th = {
            background: 'white',
            minWidth: '120px',
            Width: '120px',
            maxWidth: '120px',
            textAlign: 'center',
            verticalAlign: 'top',
        }
        let _Width = window.innerWidth;
        let _Height = window.innerHeight;
        let style_div = {

            minHeight: _Height - 70,
            minWidth: _Width - 40,

            //minHeight: this.props.w_Height - 70,
            //minWidth: this.props.w_Width - 50,
        }


        if (this.state.list_book_row != null && this.state.list_fuels != null
            && this.state.list_dvc_azs != null) {


            return (
                <div style={style_div}>

                    <table style={w_table_Main}>
                        <tbody>
                            {
                                this.state.list_book_row.map(ITEM_0 => {

                                    //if (WhatKeyNotShow(ITEM_0.key))// && this.isShow_Row_Type(ITEM_0)) 
                                    {

                                        return (

                                            <tr key={createGuid()}>
                                                {/*нулевая колонка*/}

                                                <td key={createGuid()} colSpan='2' id='style_TD'>
                                                    <Single_Coll
                                                        el={ITEM_0}
                                                        setFilter={this.setFilter}
                                                        UP={this.get_Up(ITEM_0)}

                                                        isPL_View={this.state.isPL_View}
                                                        isPUMP_View={this.state.isPUMP_View}
                                                        isTSO_View={this.state.isTSO_View}

                                                        visible={this.props.visible}
                                                        list_type_dvc={this.props.list_type_dvc}
                                                    />

                                                </td>

                                                {/*колонки данные ->  */}
                                                {this.state.list_dvc_azs != null &&
                                                    this.state.list_dvc_azs.map((el_azsS, n) => (
                                                        el_azsS.map(el_azs => {
                                                            if (ITEM_0.key == el_azs.key && ITEM_0.type == el_azs.type && el_azs.ID != 0) {

                                                                return (
                                                                    <td key={createGuid()} colSpan={el_azs.ColSpan} style={style_th}>
                                                                        <Single_Coll
                                                                            el={el_azs}
                                                                            UP={this.get_Up(ITEM_0)}
                                                                            list_fuels={this.state.list_fuels}
                                                                            history={this.state.history}
                                                                            azs={Get_ID_DVC(el_azsS, el_azs, ITEM_0)}

                                                                            isPL_View={this.state.isPL_View}
                                                                            isPUMP_View={this.state.isPUMP_View}
                                                                            isTSO_View={this.state.isTSO_View}

                                                                            visible={this.props.visible}
                                                                            list_type_dvc={this.props.list_type_dvc}

                                                                            el_azsS={el_azsS}
                                                                        />

                                                                    </td>
                                                                );
                                                            }
                                                        })
                                                    ))}
                                            </tr>
                                        );
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>
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
                    <h4><center>Неудается получить данные с сервера!!(w_AZS_SF)</center></h4>
                    <hr width={_Width - 50} />
                </div>
            );
        }
    }
}
