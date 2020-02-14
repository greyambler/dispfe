import React from 'react';
import { Image } from 'semantic-ui-react'
import useGlobal from "../../core/useGlobal.jsx";

function Filter_Check() {
    const [globalState, globalActions] = useGlobal();
    const { showdata_tso } = globalState.counters;
    const _check = el => { globalActions.showdata_tso.Showdata_TSO(!showdata_tso); };

    if (showdata_tso) {
        return (<Image src="images/arrow_Up.png" onClick={_check} />);
    } else {
        return (<Image src="images/arrow_Down.png" onClick={_check} />);
    }
};

export default class Filter_Check_TSO extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text_dvc: this.props.text_dvc,
            _up: this.props.UP,
            _arrow: this.props.UP ? "images/arrow_Up.png" : "images/arrow_Down.png",
            type: this.props.type,
        }
    }
    render() {
        let _style_tbl = {
            background: '#F0F0F0',
            height: '30px',
            width: '100%',
            minWidth: '200px',
            verticalAlign: 'top',
        }
        let _style_td = {
            marginTop: '10px',
            color: '#1A2737',
            width: "30px",
        }
        return (
            <table style={_style_tbl}>
                <tbody>
                    <tr>
                        <td>
                            {this.state.text_dvc}
                        </td>
                        <td style={_style_td}>
                            <Filter_Check />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
