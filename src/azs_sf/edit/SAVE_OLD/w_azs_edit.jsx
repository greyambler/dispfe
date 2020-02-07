import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

import W_col_TR from './col_TR.jsx';
import W_row_tr from './row_TR.jsx';

const _Debuge = false;

export default class w_azs_edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            w_Width: window.innerWidth,
            w_Height: window.innerHeight,
        };
    }

    render() {
        let div_Null_Data = {
            minHeight: this.state.w_Height,
            minWidth: this.state.w_Width,
        }
        return (
            <div style={div_Null_Data}>
                <center><h4>{this.props.header}</h4></center>
                <hr /><hr />
                <h4><center>w_azs_edit</center></h4>

                <div>
                    <form onSubmit={this.handleSubmit} onReset={this.props.onClose}>
                        <table width="300px">
                            <tbody>
                                {/*<W_row_tr name='id' type="guid" value={this.state.id} handleInputChange={this.handleInputChange} />*/}

                                <W_row_tr name='iid' type="number" value={this.state.iid} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='dispname' type="text" value={this.state.dispname} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='th_code' type="number" value={this.state.th_code} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='order_num' type="number" value={this.state.order_num} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='shortname' type="text" value={this.state.shortname} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='region_code' type="number" value={this.state.region_code} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='region_name' type="text" value={this.state.region_name} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='address' type="text" value={this.state.address} handleInputChange={this.handleInputChange} />
                                <W_row_tr name='telefon' type="text" value={this.state.telefon} handleInputChange={this.handleInputChange} />

                            </tbody>
                        </table>
                        <br />
                        <input id="_button" type="submit" value="Сохранить" />
                        <input id="_button" type="reset" value="Отмена" />
                    </form>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <td>"id_guid"</td>
                            <td>"индекс *"</td>
                            <td>"Название объекта *"</td>
                            <td>"TH код объекта"</td>
                            <td>"Номер объекта"</td>
                            <td>"Название *"</td>
                            <td>"Код региона"</td>
                            <td>"Имя региона"</td>
                            <td>"Адрес"</td>
                            <td>"Телефоны"</td>
                        </tr>
                        <tr>
                            <td><W_col_TR name='iid' type="number" value={this.state.iid} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='dispname' type="text" value={this.state.dispname} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='th_code' type="number" value={this.state.th_code} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='order_num' type="number" value={this.state.order_num} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='shortname' type="text" value={this.state.shortname} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='region_code' type="number" value={this.state.region_code} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='region_name' type="text" value={this.state.region_name} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='address' type="text" value={this.state.address} handleInputChange={this.handleInputChange} /></td>
                            <td><W_col_TR name='telefon' type="text" value={this.state.telefon} handleInputChange={this.handleInputChange} /></td>
                        </tr>
                    </tbody>
                </table>

                {/*                 <h4><center>w_azs_edit Нет данных!!!(w_azs_edit)</center></h4>
 */}                <hr width={this.state.w_Width - 30} />
            </div>
        );
    }
}

/*
import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import MDBTableEditor from 'mdb-react-table-editor';

class App extends Component {
    state = {
        data: {
            columns: [
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Position',
                    field: 'position',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Office',
                    field: 'office',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Age',
                    field: 'age',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Start date',
                    field: 'date',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Salary',
                    field: 'salary',
                    sort: 'asc',
                    width: 100
                }
            ],
            rows: [
                {
                    name: 'Tiger Nixon',
                    position: 'System Architect',
                    office: 'Edinburgh',
                    age: '61',
                    date: '2011/04/25',
                    salary: '$320'
                },
                {
                    name: 'Garrett Winters',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '63',
                    date: '2011/07/25',
                    salary: '$170'
                },
                {
                    name: 'Ashton Cox',
                    position: 'Junior Technical Author',
                    office: 'San Francisco',
                    age: '66',
                    date: '2009/01/12',
                    salary: '$86'
                },
                {
                    name: 'Cedric Kelly',
                    position: 'Senior Javascript Developer',
                    office: 'Edinburgh',
                    age: '22',
                    date: '2012/03/29',
                    salary: '$433'
                },
                {
                    name: 'Airi Satou',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '33',
                    date: '2008/11/28',
                    salary: '$162'
                },
                {
                    name: 'Brielle Williamson',
                    position: 'Integration Specialist',
                    office: 'New York',
                    age: '61',
                    date: '2012/12/02',
                    salary: '$372'
                },
                {
                    name: 'Herrod Chandler',
                    position: 'Sales Assistant',
                    office: 'San Francisco',
                    age: '59',
                    date: '2012/08/06',
                    salary: '$137'
                }
            ]
        }

    }

    render() {
        return (
            <MDBTableEditor rows={this.state.data.rows} columns={this.state.data.columns}>
                <MDBDataTable
                    striped
                    bordered
                    hover
                    data={this.state.data}
                />
            </MDBTableEditor>
        );
    }
}

export default App;
*/