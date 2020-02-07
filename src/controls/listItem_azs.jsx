import React, { Component } from 'react';

function get_Img(is_Check) {
    return (is_Check) ? "../images/Switch_on_yellow.png" : "../images/Switch_on_red.png";
}
function get_Img_Check(is_Check) {
    return (is_Check) ? "../images/check.png" : "../images/TRK/NoConnection.png";
}

export default class listItem_azs extends React.Component {
    constructor(props) {
        super(props);
        this.On_Click = this.On_Click.bind(this);

    }

    On_Click() {
        this.props.Check_OnCheck_AZS(this.props.el)
    }
    render() {
        let st_td = {
            fontSize: "12px",
            color: "white",
            minWidth: "250px",
            maxWidth: "250px",
            width: "250px",
            textAlign: "left",
            height: "30px",
            verticalAlign: "top",
        }
        return (
            <table style={st_td}>
                <tbody>
                    <tr>

                        <td width="25px" align="center">
                            {//this.props.el.check &&
                                <img className="header_Img"
                                    src={get_Img_Check(this.props.el.check)} alt="React"
                                    width="20" height="20"
                                    onClick={this.On_Click} />
                            }
                        </td>

                        <td width="30px" align="center">
                            {this.props.el.check && this.props.show_All &&
                                <img className="header_Img"
                                    src={"../images/alert-triangle.png"} alt="React"
                                    width="20" height="20"
                                    onClick={this.On_Click} />
                            }
                        </td>

                        <td width="230px" onClick={this.On_Click}>
                            <label>{this.props.el.nm}</label>
                        </td>

                    </tr>
                </tbody>
            </table>
        );
    }
}