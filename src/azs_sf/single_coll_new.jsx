import React from 'react';

import { get_Num, Get_PROPS_Single } from '../core/core_Function.jsx'
import { Element, animateScroll as scroll } from 'react-scroll'

import W_img_First from './img_First_new.jsx'
import W_tso_chaild_First_new from './TSO/tso_chaild_First_new.jsx'

import W_pl_Head from './PL/pl_Head_new.jsx'
import W_trk_Head from './TRK/trk_Head_new.jsx'
import W_tso_Head from './TSO/tso_Head_new.jsx'

import W_tso_Head_chaild_new from './TSO/tso_Head_chaild_new.jsx'

import W_Filter_Check_PL from './PL/Filter_Check_PL.jsx'
import W_Filter_Check_TRK from './TRK/Filter_Check_TRK.jsx'
import W_Filter_Check_TSO from './TSO/Filter_Check_TSO.jsx'

import W_azs_Head from './azs_Head.jsx'

import W_tso_Rec_button from './TSO/tso_Rec_button_new.jsx'
import W_tso_camera from './TSO/tso_camera.jsx'

import W_prop_value from './prop_value_new.jsx'

const _Debuge_Show_Code = false;
const _Debuge_Show_Crit = false;

export default class single_coll_new extends React.Component {
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
        let text = this.state.text;
        if (this.state.el.ID == 0 && this.state.el.key == "nm") {
            // нулевая колонка
            switch (this.state.el.type) {
                case "pl": {
                    let first_coll_pl = Get_PROPS_Single(this.props.list_type_dvc, 'pl', false);
                    return (
                        <>
                            <Element name="test4" className="element" >
                                <W_Filter_Check_PL text_dvc={text} type="pl" />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_pl} />
                            </center>
                        </>
                    );
                }
                case "pump": {
                    let first_coll_trk = Get_PROPS_Single(this.props.list_type_dvc, 'pump', false);
                    return (
                        <>
                            <Element name="test3" className="element" >
                                <W_Filter_Check_TRK text_dvc={text} type="pump" />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_trk} />
                            </center>
                        </>
                    );
                }
                case "tso": {
                    let first_coll_tso = Get_PROPS_Single(this.props.list_type_dvc, 'tso', false);
                    return (
                        <>
                            <Element name="test2" className="element" >
                                <W_Filter_Check_TSO text_dvc={text} type="tso" />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_tso} />
                            </center>
                        </>
                    );
                }
                case "fr": {
                    let first_coll_fr = Get_PROPS_Single(this.props.list_type_dvc, 'fr', false);
                    return (
                        <>
                            <Element name="test25" className="element" >
                                <W_tso_chaild_First_new text_dvc={text} />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_fr} />
                            </center>
                        </>
                    );
                }
                case "cash": {
                    let first_coll_cash = Get_PROPS_Single(this.props.list_type_dvc, 'cash', false);
                    return (
                        <>
                            <Element name="test24" className="element" >
                                <W_tso_chaild_First_new text_dvc={text} />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_cash} />
                            </center>
                        </>
                    );
                }
                case "td": {
                    let first_coll_td = Get_PROPS_Single(this.props.list_type_dvc, 'td', false);
                    return (
                        <>
                            <Element name="test23" className="element" >
                                <W_tso_chaild_First_new text_dvc={text} />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_td} />
                            </center>
                        </>
                    );
                }
                case "msc": {
                    let first_coll_msc = Get_PROPS_Single(this.props.list_type_dvc, 'msc', false);
                    return (
                        <>
                            <Element name="test22" className="element" >
                                <W_tso_chaild_First_new text_dvc={text} />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_msc} />
                            </center>
                        </>
                    );
                }
                case "cmd_mfc": {
                    let first_coll_cmd_mfc = Get_PROPS_Single(this.props.list_type_dvc, 'cmd_mfc', false);
                    return (
                        <>
                            <Element name="test21" className="element" >
                                <W_tso_chaild_First_new text_dvc={text} />
                            </Element>
                            <center>
                                <W_img_First OBJ={this.state.el} list_book={first_coll_cmd_mfc} />
                            </center>
                        </>
                    );
                }
                default: {
                    //return (<>{text}</>);
                    return (<></>);
                }
            }
        } else {
            if (this.state.el.ID != 0 && this.state.el.key == "nm" && text != "") {
                switch (this.state.el.type) {
                    case "azs": {//шапка AZS 
                        return (
                            <center>
                                <W_azs_Head
                                    OBJ={this.state.el} text={text}
                                    ID={this.state.el.ID} history={this.props.history}
                                />
                            </center>);
                    }
                    case "pl": {
                        let data_coll_pl = Get_PROPS_Single(this.props.list_type_dvc, 'pl', true);
                        return (
                            <center>
                                <W_pl_Head
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={data_coll_pl} visible={this.props.visible}
                                />
                            </center>);
                    }
                    case "pump": {//шапка ТРК 
                        let data_coll_pump = Get_PROPS_Single(this.props.list_type_dvc, 'pump', true);
                        return (
                            <center>
                                <W_trk_Head
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={data_coll_pump} visible={this.props.visible} azs={this.props.azs}
                                />
                            </center>);
                    }
                    case "tso": { //шапка TCO - CONN_STATE
                        let list_data_tso = Get_PROPS_Single(this.props.list_type_dvc, 'tso', true);
                        return (
                            <center>
                                <W_tso_Head
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={list_data_tso} visible={this.props.visible} azs={this.props.azs}
                                />
                            </center>);
                    }
                    case "fr": {//шапка ФР 
                        let list_data_fr = Get_PROPS_Single(this.props.list_type_dvc, 'fr', true);
                        return (
                            <center>
                                <W_tso_Head_chaild_new
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={list_data_fr} visible={this.props.visible} azs={this.props.azs}
                                />
                                <W_tso_Rec_button
                                    IsButton={true} text={text}
                                    title="Перезагрузка ФР" type_Body='restart_fr'
                                    el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels}
                                />
                            </center>);
                    }
                    case "cash": {//шапка Купюроприёмник	
                        let list_data_cash = Get_PROPS_Single(this.props.list_type_dvc, 'cash', true);
                        return (
                            <center>
                                <W_tso_Head_chaild_new
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={list_data_cash} visible={this.props.visible} azs={this.props.azs}
                                />
                                <W_tso_Rec_button
                                    IsButton={true} text={text}
                                    title="Перезагрузка Купюроприёмника" type_Body='restart_cash'
                                    el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels}
                                />
                            </center>);
                    }
                    case "td": {//шапка ТУ 
                        let list_data_td = Get_PROPS_Single(this.props.list_type_dvc, 'td', true);
                        return (
                            <center>
                                <W_tso_Head_chaild_new
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={list_data_td} visible={this.props.visible} azs={this.props.azs}
                                />
                            </center>);
                    }
                    case "msc": {//шапка МФК 
                        let list_data_msc = Get_PROPS_Single(this.props.list_type_dvc, 'msc', true);
                        return (
                            <center>
                                <W_tso_Head_chaild_new
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={list_data_msc} visible={this.props.visible} azs={this.props.azs}
                                />
                                <W_tso_Rec_button
                                    IsButton={true} text={text}
                                    title="Перезагрузка ПК" type_Body='restart_pc'
                                    el={this.state.el} el_azsS={this.props.el_azsS} _Fuels={this.props.list_fuels}
                                />
                                {text.startsWith("МФК на ТСО1 на АЗС2") &&
                                    <W_tso_camera WS="ws://172.23.16.18:9999" />
                                }
                                {text.startsWith("МФК на ТСО1 на АЗС1") &&
                                    <W_tso_camera WS="ws://172.23.16.18:9998" />
                                }
                            </center>);
                    }
                    case "cmd_mfc": {
                        let list_data_cmd_mfc = Get_PROPS_Single(this.props.list_type_dvc, 'cmd_mfc', true);
                        return (
                            <center>
                                <W_tso_Head_chaild_new
                                    OBJ={this.state.el} _Fuels={this.props.list_fuels}
                                    list_data={list_data_cmd_mfc} visible={this.props.visible} azs={this.props.azs}
                                />
                            </center>);
                    }
                    default: {
                        //return (<>{text}</>);
                        return (<> -- -- </>);
                    }
                }
            } else {
                return <W_prop_value prop_value={text} el={this.state.el} />
            }
        }
    }
}
