import React from 'react';

import W_switch_conrol from './switch_conrol.jsx';

import { demoAsyncCall, createGuid, WhatKeyNotShow, getColor_Crit, RSS_AZS } from '../core/core_Function.jsx'

import { List } from 'semantic-ui-react'
import ListItem_azs from './listItem_azs.jsx'

const _Debuge_Alert = true;



export default class w_Filter_AZS_Props extends React.Component {
    constructor(props) {
        super(props);
        this.onChange_Text = this.onChange_Text.bind(this);
        this.On_Click_Clean = this.On_Click_Clean.bind(this);
        this.On_Click_Show = this.On_Click_Show.bind(this);
        this.On_Click_CheckAll = this.On_Click_CheckAll.bind(this);
        this.OnColse = this.OnColse.bind(this);


        this.Check_OnCheck_AZS = this.Check_OnCheck_AZS.bind(this);
        this.Check_OnCheck_DVC = this.Check_OnCheck_DVC.bind(this);

        this.handleResize = this.handleResize.bind(this);

        this.state = {
            seach_Text: "",
            list_azs_check: this.props.list_azs_check,

            DVC: this.props.DVC,

            show_All: false,

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
        this.setState({ list_azs_check: this.props.list_azs_check, DVC: this.props.DVC });
        window.addEventListener("resize", this.handleResize);
    }
    componentDidUpdate(prevProps) {
        if (this.props.list_azs_check != prevProps.list_azs_check) {
            this.setState({ list_azs_check: this.props.list_azs_check });
        }
        if (this.props.DVC != prevProps.DVC) {
            this.setState({ DVC: this.props.DVC });
        }
    }
    On_Click_Clean() {
        let r = new Array();
        for (const iterator of this.props.list_azs_check) {
            r.push(iterator);
        }
        this.setState({ seach_Text: "", list_azs_check: r });
    }
    On_Click_Show(_show_Alll) {
        this.setState({ show_All: _show_Alll });
    }
    On_Click_CheckAll(_checked_All) {
        for (const iterator of this.state.list_azs_check) {
            iterator.check = _checked_All;
        }

        this.setState({ list_azs_check: this.state.list_azs_check });
    }
    onChange_Text(event) {
        const target = event.target;
        const value = target.value;
        let r = new Array();
        for (const iterator of this.props.list_azs_check) {
            if (iterator.nm.includes(value)) {
                r.push(iterator);
            }
        }
        this.setState({ seach_Text: value, list_azs_check: r });
    }
    Check_OnCheck_AZS(azs) {
        //alert(azs.nm);
        for (const iterator of this.state.list_azs_check) {
            if (azs.id == iterator.id) {
                iterator.check = !azs.check;
                break;
            }
        }
        this.setState({ list_azs_check: this.state.list_azs_check });
    }
    Check_OnCheck_DVC(dvc) {
        for (const iterator of this.state.DVC) {
            if (dvc.id == iterator.id) {
                iterator.check = !dvc.check;
                break;
            }
        }
        this.setState({ DVC: this.state.DVC });
    }
    OnColse() {
        if (this.props.OnColse != null)
            this.props.OnColse(this.state.list_azs_check)
    }
    render() {
        let st_td = {
            fontSize: "20px",
        }
        let st_table = {
            verticalAlign: 'top',
        }
        let st_table_typ = {
            verticalAlign: 'top',
            minWidth: "300px",
            maxWidth: "300px",
            width: "300px",
            marginRight: "10px",
        }
        let td_vert = {
            minWidth: "2px",
            maxWidth: "2px",
            width: "2px",
            background: "white",
        }
        let td_R_Exit = {
            minWidth: "2px",
            maxWidth: "2px",
            width: "30px",
            //background: "red",
            align: "center",
        }
        return (
            <table id="se_table" height={this.state.w_Height - 75} width={this.state.w_Width - 25}>
                <tbody>
                    <tr>
                        <td style={st_table}>
                            <div>
                                <table id="s_table_100">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input type="text" id="se_Input" value={this.state.seach_Text}
                                                    onChange={this.onChange_Text}
                                                />
                                                <hr align="center" width="100%" size="2" color="white" />
                                            </td>
                                            <td width="12px" align="center">
                                                <img className="header_Img" src={'../images/krest.png'} alt="React" width="14" height="14"
                                                    onClick={this.On_Click_Clean} />
                                            </td>
                                        </tr>

                                        <tr style={st_table}>
                                            <td colSpan="2">
                                                <div>
                                                    <table width="100%">
                                                        <tbody>
                                                            <tr height="30px">
                                                                <td style={st_td} align="center">Объекты</td>
                                                                <td align="right">
                                                                    <W_switch_conrol
                                                                        On_Click_Show={this.On_Click_Show}
                                                                        On_Click_Check={this.On_Click_CheckAll}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr />

                                                            <tr>
                                                                <td colSpan="2">
                                                                    <List celled horizontal>
                                                                        {this.state.list_azs_check != null &&
                                                                            this.state.list_azs_check.map((el_azs, n) => (
                                                                                <List.Item key={createGuid()}>
                                                                                    <ListItem_azs el={el_azs}
                                                                                        show_All={this.state.show_All}
                                                                                        Check_OnCheck_AZS={this.Check_OnCheck_AZS}
                                                                                    />
                                                                                </List.Item>
                                                                            ))}
                                                                    </List>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>

                        <td style={td_vert} name="верт_строка" />

                        <td style={st_table_typ}>
                            <div>
                                <table id="s_table_100">
                                    <tbody>
                                        <tr height="30px">
                                            <td width="12px"></td>
                                            <td style={td_R_Exit}>
                                                <img src={'../images/krest.png'}
                                                    alt="React" width="14" height="14"
                                                    onClick={this.OnColse} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><hr align="center" size="2" color="white" /></td>
                                            <td></td>
                                        </tr>
                                        <tr height="30px">
                                            <td style={st_td} align="center" colSpan="2">Виды устройств </td>
                                        </tr>
                                        <tr>
                                            <td><hr align="center" size="2" color="white" /></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <List celled horizontal>
                                                    {this.state.DVC != null &&
                                                        this.state.DVC.map((el_dvc, n) => (
                                                            <List.Item key={createGuid()}>
                                                                <ListItem_azs el={el_dvc}
                                                                    Check_OnCheck_AZS={this.Check_OnCheck_DVC}
                                                                />
                                                            </List.Item>
                                                        ))}
                                                </List>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
