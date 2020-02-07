import React from 'react';
import tso_First from '../TSO/tso_First';

import { createGuid } from '../../core/core_Function.jsx'
import W_row_tr from './row_TR.jsx';

import W_azs_coll_pl from './_azs_coll_pl.jsx'



export default class _azs_coll_pls extends React.Component {
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
        if (this.props.list_pl != prevProps.list_pl) {
            this.setState({ list_pl: this.props.list_pl });
        }
    }
    render() {
        let style_th = {
            background: 'white',
            minWidth: '160px',
            //width: '120px',
            maxWidth: '160px',
            textAlign: 'center',
            bgcolor: "black",
            border: '1px solid #A5ABB3',
            align: "center",
            height: '20px',

        }
        let style_td = {
            background: 'white',
            minWidth: '20px',
            //width: '120px',
            maxWidth: '40px',
            textAlign: 'center',
            bgcolor: "black",
            //border: '1px solid #A5ABB3',
            align: "center",
            height: '10px',
            verticalAlign: 'top',

        }


        if (this.state.list_pl != null) {
            return (
                <>
                    {
                        this.state.list_pl.map((PL, n) => (
                            <td valign="top" key={createGuid()}>
                                <div>
                                    <W_azs_coll_pl _up_row={this.state._up_row} list_pl={PL} />
                                </div>
                            </td>
                        ))
                    }
                </>
            );

        } else {
            return (<></>);
        }
    }
}

