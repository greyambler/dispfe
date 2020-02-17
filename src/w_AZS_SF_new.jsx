import React from 'react';

import { RSS_List_Main, Get_FIRST_COLL_Single, } from './core/core_Function.jsx'

import W_main_azs_new from './azs_sf/w_main_azs_new.jsx'

const _Debuge = false;
const _Debuge_Alert = false;

export default class w_AZS_SF_new extends React.Component {
    constructor(props) {
        super(props);
        this.tick_book = this.tick_book.bind(this);
        this.state = {
            DVC: null,
            list_type_dvc: null,
            list_fuels: null,
            list_book_row: null,
        }
    }

    componentDidMount() {
        this.setState({ DVC: this.props.DVC }, this.tick_book);
    }
    componentDidUpdate(prevProps) {
        if (this.props.DVC != prevProps.DVC) {
            this.setState({ DVC: this.props.DVC }, this.tick_book);
        }
        if (this.props.visible != prevProps.visible) {
            this.setState({ visible: this.props.visible }, this.tick_book);
        }
    }

    async tick_book() {
        if (this.state.DVC != null && !this.state.visible) {
            let rss = RSS_List_Main;
            var myRequest = new Request(rss);
            try {
                var response = await fetch(myRequest,
                    {
                        method: 'GET',
                        headers:
                        {
                            'Accept': 'application/json',
                        },
                    }
                );
                const Jsons = await response.json();
                if (response.ok) {
                    this.setState({
                        list_type_dvc: Jsons.dvctyptree, list_fuels: Jsons.fuel,
                        list_book_row: Get_FIRST_COLL_Single(Jsons.dvctyptree, this.state.DVC)
                    });
                }
                else {
                    throw Error(response.statusText);
                }
                this.setState({ isExistError: false })
            }
            catch (error) {
                this.setState({ isExistError: true })
                console.log(error);
                if (_Debuge_Alert)
                    alert(error);
            }
        } else {
            this.setState({ list_type_dvc: null, list_fuels: null, list_book_row: null });
        }
    }

    render() {
        let _Width = window.innerWidth;
        let _Height = window.innerHeight;

        if (this.state.list_type_dvc != null && Array.isArray(this.state.list_type_dvc) &&
            this.state.list_fuels != null && Array.isArray(this.state.list_fuels) &&
            this.state.list_book_row != null && Array.isArray(this.state.list_book_row) &&
            this.props.list_azs_check && Array.isArray(this.props.list_azs_check) &&
            this.props.list_azs_check.length > 0 && !this.state.visible) {
            return (
                <W_main_azs_new
                    history={this.props.history}

                    list_type_dvc={this.state.list_type_dvc}
                    list_azs_check={this.props.list_azs_check}


                    list_fuels={this.state.list_fuels}
                    list_book_row={this.state.list_book_row}

                    visible={this.props.visible}
                />
            );
        } else {
            let div_Null = {
                marginLeft: 5,
                minWidth: _Width - 40,
                minHeight: _Height - 70,
            }
            return (
                <div style={div_Null}>
                    <center><h4>{this.props.header}</h4></center>
                    <hr /><hr />
                    <h4><center>Нет данных!(w_AZS_SF_new)</center></h4>
                    <hr width={_Width - 50} />
                </div>
            );
        }
    }
}
