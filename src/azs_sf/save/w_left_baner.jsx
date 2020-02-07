import React from 'react';

import { createGuid, WhatKeyNotShow } from '../core/core_Function.jsx'

import { W_left_baner } from './w_main_azs.jsx'

import Single_Coll from '../controls/single_coll.jsx'
import Single_collAllRow from '../controls/single_collAllRow.jsx'

import Two_Coll from '../controls/two_coll.jsx'

const _Debuge = false;

export default class w_left_baner extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        //let _colS = this.props.list_azs.length;
        return (
            <div>
                <table>
                    <tbody>

                        <tr><td colSpan='2'><br /></td></tr>
                        {/*
                            this.props.list_book.map(el => (
                                (WhatKeyNotShow(el.key)) &&
                                <tr key={createGuid()}>
                                    <Single_collAllRow el={el}
                                        list_azs={this.props.list_azs}
                                        _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                </tr>
                            ))
                        */}

                        <tr><td colSpan='2'><br /></td></tr>
                        {
                            this.props.list_book.map(el => (
                                (WhatKeyNotShow(el.key)) &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} colSpan='2'>
                                        <Single_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                    </td>

                                    {this.props.list_azs.map(el_azsS => (
                                        el_azsS.map(el_azs => (
                                            (el.key == el_azs.key) &&
                                            <td key={createGuid()}>
                                                <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                            </td>
                                        ))
                                    ))}

                                </tr>
                            ))
                        }
                        <tr><td colSpan='2'><br /></td></tr>
                        {/*
                            this.props.list_book.pl.map(el => (
                                (WhatKeyNotShow(el.key)) &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} colSpan='2'>
                                        <Single_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                    </td>
                                    {this.props.list_azs.map(el_azsS => (
                                        el_azsS.pl.map(el_azs => (
                                            (el.key == el_azs.key) &&
                                            <td key={createGuid()}>
                                                <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                            </td>
                                        ))
                                    ))}
                                </tr>
                            ))
                        */}

                        <tr><td colSpan='2'><br /></td></tr>
                        {/*
                            this.props.list_book.tso.map(el => (
                                (WhatKeyNotShow(el.key)) &&
                                ((el.isDVC) ? (
                                    <tr key={createGuid()}>
                                        <Two_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                    </tr>
                                ) : (
                                        <tr key={createGuid()}>
                                            <td key={createGuid()} colSpan='2'>
                                                <Single_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                            </td>
                                            {this.props.list_azs.map(el_azsS => (
                                                el_azsS.tso.map(el_azs => (
                                                    (el.key == el_azs.key) &&
                                                    <td key={createGuid()}>
                                                        <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                                    </td>
                                                ))
                                            ))}
                                        </tr>
                                    ))
                            ))
                        }
                        
                        <tr><td colSpan='2'><br /></td></tr>
                        {
                            this.props.list_book.pump.map(el => (
                                (WhatKeyNotShow(el.key)) &&
                                <tr key={createGuid()}>
                                    <td key={createGuid()} colSpan='2'>
                                        <Single_Coll el={el} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                    </td>
                                    {this.props.list_azs.map(el_azsS => (
                                        el_azsS.pump.map(el_azs => (
                                            (el.key == el_azs.key) &&
                                            <td key={createGuid()}>
                                                <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                                            </td>
                                        ))
                                    ))}
                                </tr>
                            ))
                        */}
                    </tbody>
                </table>
            </div>
        );

    }
}
