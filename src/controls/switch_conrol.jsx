import React, { Component } from 'react';

function get_Img(is_Show) {
    return (is_Show) ?  "../images/Switch_on_red.png" :"../images/Switch_on_yellow.png";
}
function get_Img_Check(is_Check) {
    return (is_Check) ? "../images/check.png" : "../images/no_check.png";
}

export default class switch_conrol extends React.Component {
    constructor(props) {
        super(props);
        this.On_Click_Show = this.On_Click_Show.bind(this);
        this.On_Click_Check = this.On_Click_Check.bind(this);
        this.state = {
            checked_All: true,

            show_All: false,
        };
    }
    
    On_Click_Check() {
        this.setState({ checked_All: !this.state.checked_All }, this.props.On_Click_Check(!this.state.checked_All));
    }
    On_Click_Show() {
        this.setState({ show_All: !this.state.show_All }, this.props.On_Click_Show(!this.state.show_All)); 
    }
    render() {
        let st_td = {
            fontSize: "14px",
            color: "white",
            minWidth: "130px",
            maxWidth: "130px",
            width: "130px",
            textAlign: "center",
        }

        return (
            <table style={st_td}>
                <tbody>
                    <tr>
                        <td>
                            <img className="header_Img"
                                src={get_Img_Check(this.state.checked_All)} alt="React"
                                width="20" height="20"
                                onClick={this.On_Click_Check} />
                        </td>
                        <td>
                            Все объекты
                        </td>
                        <td>
                            <img className="header_Img"
                                src={get_Img(this.state.show_All)} alt="React"
                                width="50" height="30"
                                onClick={this.On_Click_Show} />
                        </td>
                        <td>
                            Объекты с отклонениями
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}