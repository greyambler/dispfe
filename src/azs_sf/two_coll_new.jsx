import React from 'react';

import { createGuid, get_Num } from '../core/core_Function.jsx'

const _Debuge_Show_Code = false;
const _Debuge_Show_Crit = false;

export default class two_coll_new extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let text = get_Num(this.props.el, _Debuge_Show_Crit);
        /* let style_TD = {
            background: 'white',
            minWidth: '90px',
            Width: '90px',
            maxWidth: '90px',
        } */

        let style_td = {
            background: 'white',
            textAlign: 'right',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "35px",
            align: "right",
            verticalAlign: 'middle',
            whiteSpace: "nowrap",

        }


        if (_Debuge_Show_Code) {
            return (
                <>
                    <td key={createGuid()} id='style_TD'>
                        {this.props.el.isMain ? (
                            text + " [ " + this.props.el.type + " / " + this.props.el.main_type + " ]"
                        ) : (
                                <></>
                            )
                        }
                    </td>
                    <td key={createGuid()} id='style_TD'>
                        {!this.props.el.isMain ? (
                            text + " [ " + this.props.el.type + " / " + this.props.el.main_type + " ]"
                        ) : (
                                <></>
                            )
                        }
                    </td>
                </>
            );
        } else {
            return (<>
                <td key={createGuid()} id='style_TD' style={style_td} colSpan='2'>

                    {text}

                </td>

            </>
            );
        }
    }
}

/*

return (<>
                <td key={createGuid()} id='style_TD' style={style_td}>
                    {this.props.el.isMain ? (
                        text
                    ) : (
                            <></>
                        )
                    }
                </td>
                <td key={createGuid()} id='style_TD' width="20px">
                    {!this.props.el.isMain ? (
                        text
                    ) : (
                            <></>
                        )
                    }
                </td>
            </>
            );

*/