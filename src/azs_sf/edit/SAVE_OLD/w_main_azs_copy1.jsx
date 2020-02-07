import React from 'react';
import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';
import { get_Line_AZS, set_Curent_Login, RSS_AZS_EDIT, Get_Main_PROPS, RSS_List_Main, createGuid, WhatKeyNotShow } from '../../core/core_Function.jsx';


import C_azs_tbl from './_azs_tbl.jsx';
import C_azs_pl from './_azs_pl.jsx';



/*
function Init_DVC() {
    let DVC = new Array();
    DVC.push({ nm: "Резервуар", typ: "pl", check: true, id: createGuid() });
    DVC.push({ nm: "ТРК", typ: "pump", check: true, id: createGuid() });
    DVC.push({ nm: "ТСО", typ: "tso", check: true, id: createGuid() });
    return DVC;
}
*/
export default class w_main_azs extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleResize = this.handleResize.bind(this);
        this.Show_up_ListAZS = this.Show_up_ListAZS.bind(this);
        this.ChooseCurentAZS = this.ChooseCurentAZS.bind(this);
        this.Show_up_ListDVC = this.Show_up_ListDVC.bind(this);

        this.state = {
            w_Width: window.innerWidth,
            //w_Height: window.innerHeight,

            curentAZS: null,

            _up_ListAZS: true,
            _arrow_ListAZS: "images/arrow_Up.png",

            _up_ListDVC: true,
            _arrow_ListDVC: "images/arrow_Up.png",

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
    }
    Show_up_ListAZS() {
        if (!this.state._up_ListAZS) {
            this.setState({ _arrow_ListAZS: "images/arrow_Up.png", _up_ListAZS: true });
        } else {
            this.setState({ _arrow_ListAZS: "images/arrow_Down.png", _up_ListAZS: false });
        }
    }
    ChooseCurentAZS(current_Row) {
        this.setState({ curentAZS: current_Row });
    }
    Show_up_ListDVC() {
        if (!this.state._up_ListDVC) {
            this.setState({ _arrow_ListDVC: "images/arrow_Up.png", _up_ListDVC: true });
        } else {
            this.setState({ _arrow_ListDVC: "images/arrow_Down.png", _up_ListDVC: false });
        }
    }

    render() {
        let div_Main = {
            //background: '#ccc',
            //height: this.state.w_Height,
            width: this.state.w_Width - 45,
        }
        let div_Main_tbl = {
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

            //background: '#ccc',
            //verticalAlign: "top",
        }
        let style_td = {
            verticalAlign: "top",
            //maxHeight: "10px",
            //height:"120px",
            border: '1px solid #A5ABB3',
            align: 'center',
        }
        let style_th = {
            background: 'white',
            //minWidth: '120px',
            //width: '120px',
            maxWidth: '140px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #A5ABB3',
            align: "center",
            height: '20px',
        }

        return (
            <div>
                <table>
                    <tbody>
                        <tr><th><h4>Конфигуратор АЗС</h4></th></tr>
                        <tr>
                            <td>
                                <div>
                                    <table>
                                        <tbody>
                                            <tr key={createGuid()}>
                                                <td width="20" key={createGuid()}>
                                                    <img src={this.state._arrow_ListAZS} className="ui mini center aligned image" onClick={this.Show_up_ListAZS} />
                                                </td>
                                                <td key={createGuid()}>
                                                    {get_Line_AZS(this.state.curentAZS)}
                                                </td>
                                            </tr>
                                            <tr key={createGuid()}>
                                                <td colSpan="2" key={createGuid()}>
                                                    {this.state._up_ListAZS &&
                                                        <C_azs_tbl div_Main={div_Main_tbl}
                                                            ChooseCurentAZS={this.ChooseCurentAZS}/>
                                                    }
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
        );
    }
}

/*

return (
            <div style={div_Main}>
                <table style={w_table_Main}>
                    <tbody>
                        <tr><th><h4>Конфигуратор АЗС</h4></th></tr>
                        <tr>
                            <td style={style_td}>
                                <div>
                                    <table>
                                        <tbody>
                                            <tr key={createGuid()}>
                                                <td width="20" key={createGuid()}>
                                                    <img src={this.state._arrow_ListAZS} className="ui mini center aligned image" onClick={this.Show_up_ListAZS} />
                                                </td>
                                                <td key={createGuid()}>
                                                    {get_Line_AZS(this.state.curentAZS)}
                                                </td>
                                            </tr>
                                            {this.state._up_ListAZS &&
                                                <tr key={createGuid()}>
                                                    <td colSpan="2" key={createGuid()}>
                                                        <C_azs_tbl div_Main={div_Main_tbl} ChooseCurentAZS={this.ChooseCurentAZS} curentAZS={this.state.curentAZS} />
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        );


*/



/*                                              {this.state.curentAZS != null &&
                                                <tr key={createGuid()}>
                                                    <td colSpan="2" key={createGuid()}>
                                                        <C_azs_pl curentAZS={this.state.curentAZS} />
                                                    </td>
                                                </tr>
                                            }
 */