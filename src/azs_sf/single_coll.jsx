import React from 'react';

import { get_Num } from '../core/core_Function.jsx'
import { Element, animateScroll as scroll } from 'react-scroll'


import W_trk_First from './TRK/trk_First.jsx'
import W_trk_Head from './TRK/trk_Head.jsx'

import W_tso_First from './TSO/tso_First.jsx'
import W_tso_Head from './TSO/tso_Head.jsx'

import W_filter_tr from './filter_tr.jsx'
import W_pl_First from './PL/pl_First.jsx'

import W_pl_Head from './PL/pl_Head.jsx'

import W_azs_Head from './azs_Head.jsx'

import W_tso_Rec_button from './TSO/tso_Rec_button.jsx'
import W_tso_camera from './TSO/tso_camera.jsx'

import W_prop_value from './prop_value.jsx'

const _Debuge_Show_Code = false;
const _Debuge_Show_Crit = false;


export default class single_coll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: [],
            el: this.props.el,
            text: get_Num(this.props.el, _Debuge_Show_Crit, _Debuge_Show_Code),
        };
    }
    componentDidMount() {
        this.setState({ el: this.props.el, text: get_Num(this.props.el, _Debuge_Show_Crit, _Debuge_Show_Code) });
    }
    componentDidUpdate(prevProps) {
        if (this.props.el != prevProps.el) {
            this.setState({ el: this.props.el, text: get_Num(this.props.el, _Debuge_Show_Crit, _Debuge_Show_Code) });
        }
    }
    
    render() {
        let text = this.state.text;//get_Num(this.props.el, _Debuge_Show_Crit, _Debuge_Show_Code);
        if (this.state.el.ID == 0 && this.state.el.key == "nm") {
            // нулевая колонка
            switch (this.state.el.type) {
                case "pl": {
                    return (
                        <>
                            <Element name="test4" className="element" >
                                <W_filter_tr text_dvc={text} type="pl" setFilter={this.props.setFilter} UP={this.props.UP} />
                            </Element>
                            {//this.props.UP &&
                                <center>
                                    <W_pl_First />
                                </center>
                            }
                        </>
                    );
                }
                case "pump": {
                    return (
                        <>
                            <Element name="test3" className="element" >
                                <W_filter_tr text_dvc={text} type="pump" setFilter={this.props.setFilter} UP={this.props.UP} />
                            </Element>
                            {//this.props.UP &&
                                <center>
                                    <W_trk_First />
                                </center>
                            }
                        </>
                    );
                }
                case "tso": {
                    return (
                        <>
                            <Element name="test2" className="element" >
                                <W_filter_tr text_dvc={text} type="tso" setFilter={this.props.setFilter} UP={this.props.UP} />
                            </Element>
                            {//this.props.UP &&
                                <center>
                                    <W_tso_First />
                                </center>
                            }
                        </>
                    );
                }
                default: {
                    //return (<>{text}</>);
                    return (<></>);
                }
            }
        } else {
            if (this.state.el.ID != 0 && this.state.el.type == "azs" && this.state.el.key == "nm" && text != "") {// && this.props.UP) {
                //шапка AZS 
                return (<center><W_azs_Head text={text} ID={this.state.el.ID} history={this.props.history} /></center>);
            } else if (this.state.el.ID != 0 && this.state.el.type == "pl" && this.state.el.key == "nm" && text != "") {// && this.props.UP) {
                //шапка Резервуар 
                return (<center>
                    <W_pl_Head text={text} el={this.state.el} _Fuels={this.props.list_fuels} Set_EL={this.Set_EL} />
                </center>);
            } else if (this.state.el.ID != 0 && this.state.el.type == "pump" && this.state.el.key == "nm" && text != "") {//&& this.props.UP) {
                //шапка ТРК 
                return (<center> <W_trk_Head text={text} el={this.state.el} _Fuels={this.props.list_fuels} /> </center>);
            } else if (this.state.el.ID != 0 && this.state.el.type == "tso" && this.state.el.key == "nm" && text != "") {//&& this.props.UP) {
                //шапка TCO - CONN_STATE
                return (<center><W_tso_Head text={text} el={this.state.el} _Fuels={this.props.list_fuels} /> </center>);
            } else if (this.state.el.ID != 0 && this.state.el.type == "fr" && this.state.el.key == "nm" && text != "") {
                //шапка ФР 
                return (<center><W_tso_Rec_button text={text} title="Перезагрузка ФР" type_Body='restart_fr' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} /></center>);
            } else if (this.state.el.ID != 0 && this.state.el.type == "cash" && this.state.el.key == "nm" && text != "") {
                //шапка Купюроприёмник	
                return (<center><W_tso_Rec_button text={text} title="Перезагрузка Купюроприёмника" type_Body='restart_cash' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} /></center>);
            }
            else if (this.state.el.ID != 0 && this.state.el.type == "msc" && this.state.el.key == "nm" && text != "") {
                //шапка МФК 
                //return (<center><W_tso_Rec_button text={text} title="Перезагрузка ПК" type_Body='restart_pc' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} /></center>);
                if (text.startsWith("МФК на ТСО1 на АЗС2")) {
                    return (<center>
                        <W_tso_Rec_button text={text} title="Перезагрузка ПК" type_Body='restart_pc' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} />
                        <W_tso_camera WS="ws://172.23.16.18:9999" />
                    </center>);
                } else if (text.startsWith("МФК на ТСО1 на АЗС1")) {
                    return (<center>
                        <W_tso_Rec_button text={text} title="Перезагрузка ПК" type_Body='restart_pc' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} />
                        <W_tso_camera WS="ws://172.23.16.18:9998" />
                    </center>);
                } else {
                    return (<center><W_tso_Rec_button text={text} title="Перезагрузка ПК" type_Body='restart_pc' el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels} /></center>);
                }
            }
            else {
                let _style = {
                    fontSize: '9px',
                    //width: '60px',
                }
                let title_Text = text;
                if (_Debuge_Show_Code) {
                    return (
                        <center style={_style} title={title_Text}>{text + " [ " + this.state.el.key + " / " + this.state.el.main_type + " ]"}</center>
                    );
                }
                else {
                    if (this.state.el.ID == 0) {
                        return (<>{text}</>);
                    } else {
                        /*return (<>{text}</>);*/
                        return <W_prop_value prop_value={text} el={this.state.el} />
                    }
                }
            }
        }
    }
}
