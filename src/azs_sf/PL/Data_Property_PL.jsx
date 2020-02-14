import React from 'react';

import { createGuid } from '../../core/core_Function.jsx';
import W_prop_value from '../prop_value_new.jsx';
import useGlobal from "../../core/useGlobal.jsx";

const Data_Property_PL = (_Object) => {
    const [globalState, globalActions] = useGlobal();
    const { showdata_pl } = globalState.counters;

    if (showdata_pl) {
        let style_td0 = {
            background: 'white',
            textAlign: 'right',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            height: "25px",
            align: "right",

            whiteSpace: "nowrap",
        }

        let style_td1 = {
            background: 'white',
            minWidth: '20px',
            width: '120px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #F0F0F0',
            verticalAlign: 'center',
            fontSize: "11px",
            height: "25px",
            align: "center",
            whiteSpace: "nowrap",
        }
        let style_td = (_Object.is_First_Coll) ? style_td0 : style_td1;

        return (
            <table width="99%">
                <tbody>
                    {
                        _Object.list_book.map(item => {
                            return (
                                <tr key={createGuid()}>
                                    <td key={createGuid()} style={style_td}>
                                        <W_prop_value item={item} coll_let={20} />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        );
    } else {
        return (<></>);
    }
};

export default Data_Property_PL;