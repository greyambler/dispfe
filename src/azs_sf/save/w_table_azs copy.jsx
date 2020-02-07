import React from 'react';

import { createGuid, WhatKeyNotShow } from '../core/core_Function.jsx'

import { W_left_baner } from './w_main_azs.jsx'

import Single_Coll from '../controls/single_coll.jsx'
import Single_collAllRow from '../controls/single_collAllRow.jsx'

import Two_Coll from '../controls/two_coll.jsx'

const _Debuge = false;

export default class w_table_azs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_book: this.props.list_book,
            list_azs: this.props.list_azs,
            DeVal: this.props.data,
        }
    }
    componentDidMount() {
        this.full_Value()
    }
    componentDidUpdate(prevProps) {
        if (this.props.data != prevProps.data) {
            this.setState({ DeVal: this.props.data }, this.full_Value);
        }
        /*
        if (this.props.list_book != prevProps.list_book) {
            this.setState({ list_book: this.props.list_book });
        }
        if (this.props.list_azs != prevProps.list_azs) {
            this.setState({ list_azs: this.props.list_azs });
        }
        */
    }
    full_Value() {
        if (this.state.DeVal != null) {

            for (const item of this.state.list_azs) {
                let r = 0;
            }
        }
    }

    render() {
        if (this.state.list_book != null && this.state.list_azs != null) {
            return (
                <div>
                    <table>
                        <tbody>

                            {
                                this.state.list_book.map(el =>
                                    (WhatKeyNotShow(el.key) && el.main_type != "ups" && el.type != "nozzle" && el.main_type != "nozzle") &&
                                    (
                                        (el.isDVC)
                                            ? (
                                                <tr key={createGuid()}>
                                                    <Two_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />

                                                    {this.state.list_azs.map(el_azsS => (
                                                        el_azsS.map(el_azs => (
                                                            (el.key == el_azs.key && el.type == el_azs.type) &&
                                                            <td key={createGuid()}>
                                                                <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                                            </td>
                                                        ))
                                                    ))}
                                                </tr>
                                            )
                                            : (
                                                <tr key={createGuid()}>
                                                    <td key={createGuid()} colSpan='2'>
                                                        <Single_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                                    </td>
                                                    {this.state.list_azs.map(el_azsS => (
                                                        el_azsS.map(el_azs => (
                                                            (el.key == el_azs.key && el.type == el_azs.type) &&
                                                            <td key={createGuid()}>
                                                                <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                                            </td>
                                                        ))
                                                    ))}
                                                </tr>
                                            )
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (<h2> Нет данных.</h2>);
        }
    }
}

{/*
    
    this.props.list_book.map(el => (
                                (WhatKeyNotShow(el.key)) &&
                                <tr key={createGuid()}>
                                {el.main_type != "ups" &&
                                    <td key={createGuid()} colSpan='2'>
                                        <Single_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                    </td>
                                    
                                }

                                </tr>
                            ))
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    this.props.list_azs.map(el_azsS => (
                                        el_azsS.map(el_azs => (
                                            (el.key == el_azs.key) &&
                                            <td key={createGuid()}>
                                                <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                            </td>
                                        ))
                                    ))*/}