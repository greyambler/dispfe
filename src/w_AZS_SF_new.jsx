import React from 'react';

import { Element, animateScroll as scroll } from 'react-scroll'

import {
    RSS_List_Main, RSS_AZS,
    Get_FIRST_COLL_Single,
    Get_Main_PROPS_AZS_Single
} from './core/core_Function.jsx'


import W_table_azs from './azs_sf/w_table_azs_new.jsx'

import W_main_azs_new from './azs_sf/w_main_azs_new.jsx'

const _Debuge = false;
const _Debuge_Alert = false;

export default class w_AZS_SF_new extends React.Component {
    constructor(props) {
        super(props);
        this.tick_book = this.tick_book.bind(this);
        this.state = {
            loading: true,//окно ожидания
            list_type_dvc: null, list_fuels: null, list_book_row: null,
        }
    }

    componentDidMount() {
        this.tick_book(this.props.DVC);
        //this.setState({ DVC: this.props.DVC });//, this.tick_book(this.state.DVC));

    }
    componentDidUpdate(prevProps) {
        if (this.props.DVC != prevProps.DVC) {
            this.tick_book(this.props.DVC);
            //this.setState({ DVC: this.props.DVC });//, this.tick_book(this.state.DVC));
        }
    }

    async tick_book(DVC) {
        if (DVC != null) {
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
                    this.setState({ list_type_dvc: Jsons.dvctyptree, list_fuels: Jsons.fuel, list_book_row: Get_FIRST_COLL_Single(Jsons.dvctyptree, DVC) });
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
        }
    }

    render() {
        let _Width = window.innerWidth;
        let _Height = window.innerHeight;

        if (this.state.list_type_dvc != null && this.state.list_fuels != null &&
            this.state.list_book_row != null && this.props.list_azs_check && this.props.list_azs_check.length > 0) {
            return (
                <W_main_azs_new

                    list_type_dvc={this.state.list_type_dvc}
                    list_fuels={this.state.list_fuels}
                    list_book_row={this.state.list_book_row}

                    list_azs_check={this.props.list_azs_check}

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
