import React from 'react';
import { Image } from 'semantic-ui-react'
import useGlobal from "../../core/useGlobal.jsx";

function Filter_Check() {
    const [globalState, globalActions] = useGlobal();
    const { showdata_pl } = globalState.counters;
    const _check = el => {
        globalActions.showdata_pl.Showdata_PL(!showdata_pl);
    };
    if (showdata_pl) {
        return (<Image src="images/arrow_Up.png" onClick={_check} />);
    } else {
        return (<Image src="images/arrow_Down.png" onClick={_check} />);
    }
};

export default class Filter_Check_PL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text_dvc: this.props.text_dvc,
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
