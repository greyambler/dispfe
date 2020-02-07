import React from 'react';

import { Element, animateScroll as scroll } from 'react-scroll'

import { demoAsyncCall, RSS_List_Main, RSS_AZS, Get_Main_PROPS } from './core/core_Function.jsx'
import W_main_azs from './azs_sf/w_main_azs.jsx'

const _Debuge = false;
const _Debuge_Alert = true;

export default class w_AZS_SF extends React.Component {
    constructor(props) {
        super(props);
        this.Get_BOOK_From_TREE = this.Get_BOOK_From_TREE.bind(this);
        //this.is_Full_All = this.is_Full_All.bind(this);
        this.Full_BOOK_From_AZS = this.Full_BOOK_From_AZS.bind(this);


        this.get_Id_Devices = this.get_Id_Devices.bind(this);

        this.View_Modal_Err = this.View_Modal_Err.bind(this);
        this.View_Modal_Ok = this.View_Modal_Ok.bind(this);

        this.state = {
            loading: true,
            header: 'Объекты.',
            isExistError: true,

            _List_Main: null,
            _List_AZS: null,


            _array_ID: null,
            list_book: null,
            
            //list_azs: null,

            openModal_Err: false,
            openModal_Ok: false,
        }
    }

    /***Modal_Alert */
    View_Modal_Err(stt) {
        this.setState({ openModal_Err: stt });
    }
    View_Modal_Ok(stt) {
        this.setState({ openModal_Ok: stt });
    }
    /***Modal_Alert */
    componentDidMount() {
        this.tick();
        this.tick_AZS();
        demoAsyncCall().then(() => this.setState({ loading: false }));
    }
    /*
    componentDidUpdate(prevProps) {
        if (this.props.list_book != prevProps.list_book) {
            this.setState({ list_book: this.props.list_book });
        }
    }
    */

    async tick() {
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
                this.setState({ _List_Main: Jsons.dvctyptree }, this.Get_BOOK_From_TREE);
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
    async tick_AZS() {
        let rss = RSS_AZS;
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
                this.setState({ _List_AZS: Jsons.obList }, this.get_Id_Devices);
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
    async tick_dev_AZS(RES,id_azs) {
        let rss = RES + '/' + id_azs;
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
                return Jsons.dvc;
            }
            else {
                throw Error(response.statusText);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async get_Id_Devices() {
        this.Full_BOOK_From_AZS();
        this.setState({ list_azs: null });
        let M_ID = new Array();
        if (this.state._List_AZS != null) {
            for (const iterator of this.state._List_AZS) {
                let rss = await this.tick_dev_AZS(RSS_AZS, iterator.id);
                if (rss != null) {
                    for (const dvc of dvc) {
                        M_ID.push(dvc.id);
                    }
                }
            }
            this.setState({ _array_ID: M_ID });
        }
    }
    Get_BOOK_From_TREE() {
        let BOOK_All = Get_Main_PROPS(this.state._List_Main);
        this.setState({ list_book: BOOK_All });
    }

    Full_BOOK_From_AZS(dvc_azs,idAZS) {
        if (dvc_azs != null) {
            if (/*this.state._List_Main != null &&*/ this.state._List_AZS != null) {
                let BOOK_All_AZSs = new Array();
                for (const asz of this.state._List_AZS) {
                    let BOOK_AZS = Get_Main_PROPS(this.state._List_Main, asz, dvc_azs);
                    BOOK_All_AZSs.push(BOOK_AZS);
                }
                this.setState({ list_azs: BOOK_All_AZSs });
            }
            else{
                let r=0;
            }
        }
    }

    render() {
        /***** Ждать *****************/
        const { loading } = this.state;
        if (loading) {
            let stayle_1 = {
                marginTop: '130px',
            }
            return (
                <div align="center">
                    <center><h1>Запрос данных.</h1></center>
                    <img src='images/anim_engine.gif' style={stayle_1} />
                </div>
            );
        }

        if (this.state.list_book != null && 
            //this.state.list_azs != null && 
            this.state._array_ID != null) {
            return (
                <W_main_azs
                    w_Height={this.props.w_Height}
                    w_Width={this.props.w_Width}
                    history={this.props.history}
                    list_book={this.state.list_book}
                    //list_azs={this.state.list_azs}
                    list_id={this.state._array_ID}

                />
            );
        } else {
            return (
                <div>
                    <center><h4>{this.props.header}</h4></center>
                    <hr /><hr />
                    <h4><center>Нет связи с сервером!!(w_AZS_SF)</center></h4>
                </div>
            );
        }
    }
}
