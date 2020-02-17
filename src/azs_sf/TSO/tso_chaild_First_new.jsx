import React from 'react';

export default class tso_chaild_First_new extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text_dvc: this.props.text_dvc,
        }
    }
    render() {
        let _style_tbl = {
            background: 'white',
            height: '50px',
            width: '100%',
            minWidth:'200px',
            verticalAlign: 'top',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
        }
        return (
            <table style={_style_tbl}>
                <tbody>
                    <tr>
                        <td>
                            {this.state.text_dvc}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
