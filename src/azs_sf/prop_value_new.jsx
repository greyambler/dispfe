import React from 'react';

import { demoAsyncCall, createGuid, WhatKeyNotShow, getColor_Crit } from '../core/core_Function.jsx'

const _Debuge = false;

const _D_ID = false;
const _D_key = true;
const _D_key_value = true;
const _D_main_type = false;
const _D_prop_value = true;
const _D_type = false;

export default class prop_value_new extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            coll_let: this.props.coll_let,
        }
    }

    render() {
        if (this.state.item != null) {

            let _Text = this.state.item.key_value.toString();

            let keyVal = parseInt(this.state.item.key_value);
            if (!isNaN(keyVal)) {
                if (this.state.item.OP != null && this.state.item.OP.length > 0) {
                    let text = this.state.item.OP[this.state.item.key_value];
                    if (text != undefined) {
                        _Text = text;
                    }
                }
            }

            if (_Debuge) {
                let style_td = {
                    background: 'white',
                    minWidth: '170px',
                    width: '100%',
                    textAlign: 'left',
                    bgcolor: "black",
                    border: '1px solid #F0F0F0',
                    verticalAlign: 'top',
                    fontSize: "9px",
                    height: "25px",
                    minHeight: "25px",
                    align: "left",
                }
                return (
                    <table>
                        <tbody>
                            {_D_ID &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        {"ID - " + this.props.ID_CONST}

                                    </td>
                                </tr>
                            }
                            {_D_key &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        {"key - " + this.state.item.key}
                                    </td>
                                </tr>
                            }
                            {_D_key_value &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        {"key_value - " + this.state.item.key_value}
                                    </td>
                                </tr>
                            }

                            {_D_main_type &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        {"main_type - " + this.state.item.main_type}
                                    </td>
                                </tr>
                            }
                            {_D_prop_value &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        {"prop_value - " + this.state.item.prop_value}
                                    </td>
                                </tr>
                            }
                            {_D_type &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        {"type - " + this.state.item.type}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                );
            }
            else {
                let _bgcolor = 'white';
                if (this.state.item.crit != null) {
                    let Crit = parseInt(this.state.item.crit);
                    if (!isNaN(Crit)) {
                        _bgcolor = getColor_Crit(Crit);
                    }
                }
                let style_td = {
                    background: _bgcolor,
                    whiteSpace: "nowrap",
                    marginRight: "1px",
                    marginLeft: "1px",

                }
                let col = (this.state.coll_let == null) ? 11 : this.state.coll_let;

                let VAL = (_Text.length < col && !this.state.is_All_Text)
                    ? _Text : _Text.substring(0, col);
                return (
                    <div key={createGuid()} style={style_td} title={_Text} >{VAL}</div>
                );
            }
        } else {
            return (
                <></>
            );
        }
    }
}
