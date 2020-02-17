import React from 'react';
import { createGuid } from '../core/core_Function.jsx'
import Single_Coll from './single_coll_new.jsx'

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
        this.state = {
            history: this.props.history,

            list_fuels: this.props.list_fuels,
            list_book_row: this.props.list_book_row,
            list_dvc_azs: this.props.list_dvc_azs,
        }
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
        }

        if (this.state.list_book_row != null && Array.isArray(this.state.list_book_row) &&
            this.state.list_fuels != null && Array.isArray(this.state.list_fuels) &&
            this.state.list_dvc_azs != null && Array.isArray(this.state.list_dvc_azs)
        ) {
            return (
                <div style={style_div}>

                    <table style={w_table_Main}>
                        <tbody>
                            {
                                this.state.list_book_row.map(ITEM_0 => {
                                    return (

                                        <tr key={createGuid()}>
                                            {/*нулевая колонка*/}

                                            <td key={createGuid()} colSpan='2' id='style_TD'>
                                                <Single_Coll
                                                    el={ITEM_0}
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

                                                                        key={el_azs.ID}
                                                                        list_fuels={this.state.list_fuels}
                                                                        history={this.state.history}
                                                                        azs={Get_ID_DVC(el_azsS, el_azs, ITEM_0)}

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
                                })
                            }
                        </tbody>
                    </table>
                </div>
            );
        } else {
            let div_Null = {
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
