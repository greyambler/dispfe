import React from 'react';

import { demoAsyncCall, createGuid, WhatKeyNotShow, getColor_Crit } from '../core/core_Function.jsx'

const _Debuge = false;
const _Debuge_key = false;
const _Debuge_id = false;
const _Debuge_dvc_id = true;

export default class prop_value extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /*        return (
                    <>{this.props.prop_value}</>
                );
    
                {this.getStyle(this.props.el)}
                 id="s_table"
                */
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
            fontSize: "9px",

        }
        if (this.props.prop_value == "" || this.props.prop_value == " " || this.props.prop_value == "_") {
            return (<></>);
        } else {
            let _bgcolor = 'white';
            if (this.props.el.crit != null) {
                let Crit = parseInt(this.props.el.crit);
                if (!isNaN(Crit)) {
                    _bgcolor = getColor_Crit(Crit);
                }
            }
            if (_Debuge) {
                return (
                    <table id="s_table" bgcolor={_bgcolor} >
                        <tbody>
                            {_Debuge_key &&
                                <tr key={createGuid()}>
                                    <td style={style_td} key={createGuid()}>{this.props.el.key}</td>
                                </tr>
                            }
                            {_Debuge_id &&
                                <tr key={createGuid()}>
                                    <td style={style_td} key={createGuid()}>{this.props.el.ID}</td>
                                </tr>
                            }
                            {_Debuge_dvc_id &&
                                <tr key={createGuid()}>
                                    <td style={style_td} key={createGuid()}>{this.props.el.dvc_id}</td>
                                </tr>
                            }
                            <tr key={createGuid()}>
                                <td style={style_td} key={createGuid()}>{this.props.prop_value}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            } else {
                return (
                    <table id="s_table" bgcolor={_bgcolor} >
                        <tbody>
                            <tr key={createGuid()}>
                                <td key={createGuid()}>{this.props.prop_value}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
        }
    }
}