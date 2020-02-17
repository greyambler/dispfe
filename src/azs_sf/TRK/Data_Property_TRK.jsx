import React from 'react';

import { createGuid } from '../../core/core_Function.jsx';
import W_prop_value from '../prop_value_new.jsx';
import useGlobal from "../../core/useGlobal.jsx";

const Data_Property_TRK = (_Object) => {
    const [globalState, globalActions] = useGlobal();
    const { showdata_trk } = globalState.counters;

    if (showdata_trk) {
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

            textAlign: 'center',
            bgcolor: "black",
            height: "26px",
            align: "center",
            whiteSpace: "nowrap",

            WebkitBorderRadradius: "6px",
            MozBorderRadius: "6px",
            borderRadius: "6px",
            transition: "0.2s",
            border: "1px solid #A5ABB3",
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
                                        <W_prop_value item={item} coll_let={_Object.is_First_Coll ? 20 : 11} />
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

export default Data_Property_TRK;