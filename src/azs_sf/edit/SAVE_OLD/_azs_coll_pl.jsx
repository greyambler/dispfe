import React from 'react';
import tso_First from '../TSO/tso_First';

import { createGuid } from '../../core/core_Function.jsx'
import W_row_tr from './row_TR.jsx';

export default class _azs_coll_pl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _arrow_PL: "images/arrow_Down.png",
            _up_row: this.props._up_row,
            list_pl: this.props.list_pl,
            //list_Pl_ListData: this.props.list_Pl_ListData,
        };
    }

    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        if (this.props._up_row != prevProps._up_row) {
            this.setState({ _up_row: this.props._up_row });
        }
    }
    render() {
        let style_th = {
            background: 'white',
            minWidth: '120px',
            //width: '120px',
            maxWidth: '120px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #A5ABB3',
            align: "center",
            height: '20px',

        }
        let style_th_img = {
            background: 'white',
            //minWidth: '20px',
            //width: '120px',
            //maxWidth: '20px',
            textAlign: 'center',
            //bgcolor: "black",
            //border: '1px solid #A5ABB3',
            align: "center",
            height: '50px',
            maxHeight: '50px',
            minHeight: '50px',
            //valign: "top",
        }
        let st_tr = {
            //valign: "top",
            height: '40px',
            maxHeight: '40px',
            minHeight: '40px',
            fontSize: "11px",
            align: "center",
        }

        if (this.state.list_pl != null) {
            return (
                <table>
                    <tbody>
                        {
                            this.state.list_pl.map(el => {
                                if (el.type == "img") {
                                    return (
                                        <tr key={createGuid()}>
                                            <td style={style_th_img} key={createGuid()}>
                                                <center>
                                                    <img src={el.nm} className="ui mini image" />
                                                </center>
                                            </td>
                                            {/*                                         <td style={style_td}>
                                            {el.prop}
                                        </td> */}
                                        </tr>
                                    );
                                }
                                else {
                                    return (
                                        this.state._up_row &&
                                        <tr key={createGuid()} style={st_tr}>
                                            <td style={style_th} colSpan="2">{el.nm}</td>
                                        </tr>
                                    );
                                }
                            })
                        }
                    </tbody>
                </table>
            );

        } else {
            return (<></>);
        }
    }
}

/*

                            } else if (el.type == "nm") {
                                return (
                                    <tr key={createGuid()} style={style_td}>
                                        <td >
                                            {el.nm}
                                        </td>
                                    </tr>
                                );


*/