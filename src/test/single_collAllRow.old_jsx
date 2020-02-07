import React from 'react';
import { createGuid } from '../core/core_Function.jsx'
import Single_Coll from './single_coll.jsx'

export default class single_collAllRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let key = this.props.el.key;

        return (
            <>
                <td key={createGuid()} colSpan='2'>
                    {this.props.el.key_value + "_[" + this.props.el.key + "]"}
                </td>
                {this.props.list_azs.map(el_azsS => (
                    
                    el_azsS.map(el_azs => (
                        (key == el_azs.key) &&
                        <td key={createGuid()} colSpan='2'>
                            <Single_Coll el={el_azs} _Debuge_Show_Code={this.props._Debuge_Show_Code} />
                        </td>
                    ))

                ))}
            </>
        );

    }
}