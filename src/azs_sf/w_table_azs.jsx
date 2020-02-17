import React from 'react';

import { createGuid, WhatKeyNotShow } from '../core/core_Function.jsx'

import Single_Coll from './single_coll.jsx'
import Two_Coll from './two_coll.jsx'

const _Debuge = false;

export default class w_table_azs extends React.Component {
    constructor(props) {
        super(props);
        this.setFilter = this.setFilter.bind(this);
        this.get_Up = this.get_Up.bind(this);
        this.isShow_Row_Type = this.isShow_Row_Type.bind(this);

        this.state = {
            isPL_View: false,
            isPUMP_View: false,
            isTSO_View: false,

            List_dvc_azs: this.props.List_dvc_azs,
            list_fuels: this.props.list_fuels,
            list_book_row: this.props.list_book_row,
            history: this.props.history,

        }
    }
    componentDidMount() {
        this.setState({ List_dvc_azs: this.props.List_dvc_azs });
        this.setState({ list_fuels: this.props.list_fuels });
        this.setState({ list_book_row: this.props.list_book_row });
        this.setState({ history: this.props.history });
    }
    componentDidUpdate(prevProps) {
        if (this.props.List_dvc_azs != prevProps.List_dvc_azs) {
            this.setState({ List_dvc_azs: this.props.List_dvc_azs });
        }
        if (this.props.list_fuels != prevProps.list_fuels) {
            this.setState({ list_fuels: this.props.list_fuels });
        }
        if (this.props.list_book_row != prevProps.list_book_row) {
            this.setState({ list_book_row: this.props.list_book_row });
        }
        if (this.props.history != prevProps.history) {
            this.setState({ history: this.props.history });
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
                if (el.ID == 0 && el.key == "nm" && (el.type == "tso" || el.type == "fr" || el.type == "msc" || el.type == "cash")
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
        }
        let style_div = {
            minHeight: this.props.w_Height - 70,
            minWidth: this.props.w_Width - 50,
        }

        let r = 0;

        return (
            <div style={style_div}>
                <table style={w_table_Main}>
                    <tbody>
                        {
                            this.state.list_book_row.map(el => {

                                if (WhatKeyNotShow(el.key) && this.isShow_Row_Type(el)) {
                                    if (el.isDVC) {

                                        return (
                                            <tr key={createGuid()}>

                                                {/*нулевая колонка*/}
                                                <Two_Coll el={el} />

                                                {/*колонки данные -> */}
                                                {this.state.List_dvc_azs != null &&
                                                    this.state.List_dvc_azs.map((el_azsS, n) => (
                                                        el_azsS.map(el_azs => {
                                                            if (el.key == el_azs.key && el.type == el_azs.type) {
                                                                return (
                                                                    <td key={createGuid()} colSpan={el_azs.ColSpan} style={style_th}>
                                                                        <Single_Coll
                                                                            key={el_azs.ID}
                                                                            el={el_azs}
                                                                            el_azsS={el_azsS}
                                                                        />
                                                                    </td>
                                                                );
                                                            }
                                                        })
                                                    ))}
                                            </tr>
                                        );
                                    } else {

                                        return (
                                            <tr key={createGuid()}>
                                                {/*нулевая колонка*/}

                                                <td key={createGuid()} colSpan='2' id='style_TD'>
                                                    <Single_Coll
                                                        el={el}
                                                        setFilter={this.setFilter}
                                                        UP={this.get_Up(el)}
                                                    />
                                                </td>

                                                {/*колонки данные -> */}
                                                {this.state.List_dvc_azs != null &&
                                                    this.state.List_dvc_azs.map((el_azsS, n) => (
                                                        el_azsS.map(el_azs => {
                                                            if (el.key == el_azs.key && el.type == el_azs.type && el_azs.ID != 0) {

                                                                return (
                                                                    <td key={createGuid()} colSpan={el_azs.ColSpan} style={style_th}>
                                                                        <Single_Coll
                                                                            key={el_azs.ID}
                                                                            el={el_azs}
                                                                            UP={this.get_Up(el)}
                                                                            list_fuels={this.state.list_fuels}
                                                                            history={this.state.history}
                                                                        />
                                                                    </td>
                                                                );

                                                            }
                                                        })
                                                    ))}
                                            </tr>
                                        );
                                    }
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
