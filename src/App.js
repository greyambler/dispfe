import React, { Component } from 'react';
import PropTypes from 'prop-types'

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import './App.css';

import { Segment, Sidebar } from 'semantic-ui-react'
import {
  demoAsyncCall,
  _IS_NEW, saveToken, RSS_AZS_EDIT, set_Curent_Login, get_Curent_Login, refreshPage, compare_azs_iid, Init_DVC
} from './core/core_Function.jsx'
import history from "./controls/history";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Link as S_Link, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import W_AZS_SF from './w_AZS_SF.jsx'
import AZS_SF_new from './w_AZS_SF_new.jsx'

import W_main_azs from './azs_sf/edit/w_main_azs.jsx'

import W_ListErr_AZS from './controls/listErr_AZS.jsx';
import W_Login from './w_Login.jsx'
import W_LeftPanel from './test/w_LeftPanel.jsx'
import W_AccordPanel from './test/w_AccordPanel.jsx'
import W_test_Check from './test/test_Check.jsx'
import W_Set_Filter from './controls/w_Filter_AZS_Props.jsx'
import AZS_Image from './controls/AZS_Image.jsx'
import { Stage, Layer, Text } from 'react-konva';


const _Debuge_TestMenu = false;
const _Debuge = false;  // true;

class Filter_Sidebar_Main extends Component {
  render() {
    return (
      <Sidebar
        as={Segment}
        animation={this.props.animation} direction={this.props.direction}
        visible={this.props.visible}
        icon='labeled' vertical width='thin'>

        <W_Set_Filter

          OnColse={this.props.T_close}
          list_azs_check={this.props.list_azs_check}
          DVC={this.props.DVC}

        />
      </Sidebar>
    );
  }
}
function get_list_azs_check_NEED(list_azs_check) {
  let r = new Array();
  if (list_azs_check != null && Array.isArray(list_azs_check)) {
    for (const iterator of list_azs_check) {
      if (iterator.check) {
        r.push(iterator);
      }
    }
  }
  return r;
}
function get_DVC_NEED(DVC_check) {
  let r = new Array();
  if (DVC_check != null) {
    for (const iterator of DVC_check) {
      if (iterator.check) {
        r.push(iterator);
      }
    }
  }
  return r;
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: this.props.history,
      visible: this.props.visible,
      DVC: null,
      list_azs_check: null,
    }
  }
  componentDidMount() {
    this.setState({ DVC: this.props.DVC, list_azs_check: this.props.list_azs_check });
  }
  componentDidUpdate(prevProps) {
    if (this.props.DVC != prevProps.DVC) {
      this.setState({ DVC: this.props.DVC });
    }
    if (this.props.list_azs_check != prevProps.list_azs_check) {
      this.setState({ list_azs_check: this.props.list_azs_check });
    }
  }
  render() {
    return (<AZS_SF
      history={this.props.history}
      visible={this.props.visible}
      DVC={this.state.DVC}
      list_azs_check={this.state.list_azs_check}
    />);
  }
}
class AZS_SF extends Component {
  render() {
    if (_IS_NEW) {
      return (
        <AZS_SF_new
          history={this.props.history}
          visible={this.props.visible}
          DVC={this.props.DVC}
          list_azs_check={this.props.list_azs_check}
        />
      );
    } else {
      return (
        <W_AZS_SF
          history={this.props.history}
          visible={this.props.visible}
          DVC={this.props.DVC}
          list_azs_check={this.props.list_azs_check}
        />
      );
    }
  }
}
class CleanTOKEN extends Component {
  render() {
    saveToken(null);
    //this.props.history.push('/');
    window.location.reload(true);
    return <center><h2>Очистить</h2></center>;
  }
}
class Help extends Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      loading: true,//окно ожидания
      w_Width: window.innerWidth,
      w_Height: window.innerHeight,
    }
  }
  handleResize() {
    this.setState({ w_Width: window.innerWidth, w_Height: window.innerHeight })
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidMount() {
    demoAsyncCall().then(() => this.setState({ loading: false }));
    window.addEventListener("resize", this.handleResize);
  }
  componentDidUpdate(prevProps) {
    if (this.props.w_Width !== prevProps.w_Width) {
      this.setState({ w_Width: this.props.w_Width });
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
          <center><h1>Помощь.</h1></center>
          <img src='images/anim_engine.gif' style={stayle_1} />
          <hr width={this.state.w_Width - 50} />
        </div>
      );
    }
    /***** Ждать *****************/

    let div_Null_Data = {
      minHeight: this.state.w_Height - 70,
      minWidth: this.state.w_Width - 50,
    }
    return (
      <div style={div_Null_Data}>
        <center><h2>Помощь</h2></center>
        <hr width={this.state.w_Width - 50} />
      </div>
    );
  }
}
class LeftPanel extends Component {
  render() {

    return (<W_LeftPanel
      history={this.props.history} />);
  }
}
class AccordPanel extends Component {
  render() {
    return (<W_AccordPanel
      history={this.props.history} />);
  }
}
class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count_AZS: "0",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.count_AZS !== prevProps.count_AZS) {
      this.setState({ count_AZS: this.props.count_AZS });
    }
  }

  render() {
    return (
      <nav>
        <table className="header_Right">
          <tbody>
            <tr>
              <td id='td_mb'>
                <button className='btn_Reload' type="button" title="фильтр"
                  onClick={this.props.handleAnimationChange('overlay')}>
                  <Stage width={34} height={34} x={-2} y={0}>
                    <Layer key='1' background='red' >
                      <AZS_Image Image='../images/Normal.png'
                        _W='25' _H='25' _X={0} _Y={7} />
                      <AZS_Image Image='../images/no_check.png'
                        _W='12' _H='12' _X={14} _Y={7} />
                      <Text x={16} y={10} text={this.state.count_AZS} fontSize={9} />
                    </Layer>
                  </Stage>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <ul className="topmenu">

          <li>
            <a className="test2">Меню</a>
            <ul className="submenu">
              <li><Link to="/AZS_SF" >Начальная</Link></li>

              {_Debuge_TestMenu &&
                <li>
                  <a className="test2">Справочники&gt;&gt;</a>
                  <ul className="submenu">
                    <li><Link to="/AZS_Edit_0">АЗК_0</Link></li>
                    <li><Link to="/AZS_Edit_01">АЗК</Link></li>
                    <li><Link to="/AZS_Edit">АЗК1</Link></li>
                    <li><Link to="/List_Edit_AZS">Справочник АЗК save</Link></li>
                  </ul>
                </li>
              }

              <li>
                <a className="test2">Справочники&gt;&gt;</a>
                <ul className="submenu">
                  <li><Link to="/AZS_Edit">АЗК</Link></li>
                </ul>
              </li>
              <li><Link to="/settings" >Настройки</Link></li>

              <li><Link to="/help" >Помощь</Link></li>
            </ul>
          </li>

          <table className="header_Text">
            <tbody>
              <tr>
                <td id='td_m'>
                  <S_Link activeClass="active" className="test2" to="test2"
                    spy={true} smooth={true} duration={500} offset={-40}>  тсо</S_Link>
                </td><td id='td_m'>
                  <S_Link activeClass="active" className="test3" to="test3"
                    spy={true} smooth={true} duration={500} offset={-40}> трк</S_Link>
                </td><td id='td_m'>
                  <S_Link activeClass="active" className="test4" to="test4"
                    spy={true} smooth={true} duration={500} offset={-40}>  резервуары</S_Link>
                </td>
                <td id="td_max">
                </td>
              </tr>
            </tbody>
          </table>

          <table className="header_Left">
            <tbody>
              <tr>
                <td id='td_mb'>
                  <button className='btn_Reload' type="button" onClick={refreshPage}>
                    <img className="header_Img" src={'../images/Repeat.png'} alt="React"
                      width="14" height="14" />
                  </button>
                </td>
                <td id='td_user'>
                  {get_Curent_Login()}
                </td>
                <td id='td_mb'>
                  <Link to="/clean">
                    <img className="header_Img" src={'../images/log-out.png'} alt="React"
                      width="22" height="22" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </ul>
      </nav>
    );
  }
}

const AZS_Edit = (props) => <W_main_azs history={props.history} />
const AZS_listerror = (props) => <W_ListErr_AZS _List_Objs={props._List_Objs} azs_id={props.azs_id} />
const Settings = (props) => <W_test_Check />
const NotFound = (props) => <center><h2>Ресурс не найден</h2></center>


export default class App extends Component {
  constructor(props) {
    super(props);
    //this.T_close = this.T_close.bind(this);
    this.tick = this.tick.bind(this);
    this.state = {
      list_azs_check: null,
      DVC: Init_DVC(),
      direction: 'top',//'left',//'bottom',//
      animation: 'overlay',
      visible: false,
    }
    this.tick();
  }

  handleAnimationChange = (animation) => () => this.setState((prevState) =>
    ({
      animation,
      visible: !prevState.visible,
      list_azs_check: prevState.list_azs_check
    }))

  T_close = (list_AZS_check) => { this.setState({ visible: false, list_azs_check: list_AZS_check }); }

  async tick() {
    let rss = RSS_AZS_EDIT;
    let token = localStorage.tokenData;
    if (token != null) {
      let r = token.indexOf("!^!");
      set_Curent_Login(token.substring(0, r));
      token = token.substring(r + 3);
    }
    var myRequest = new Request(rss);
    try {
      var response = await fetch(myRequest,
        {
          method: 'GET',
          headers:
          {
            'Authorization': "Bearer" + token,
            'Accept': 'application/json',
          },
        }
      );
      const Jsons = await response.json();
      if (response.ok) {

        let _data = Jsons.object;
        if (_data != null && Array.isArray(_data)) {
          let List_AZS = new Array();
          for (const item of _data) {
            List_AZS.push({
              iid: item.iid,
              id: item.id,
              nm: item.dispname,
              check: true
            });
          }
          this.setState({ list_azs_check: List_AZS.sort(compare_azs_iid) });
        }
      }
      else {
        throw Error(response.statusText);
      }
      this.setState({ isExistError: false })
    }
    catch (error) {
      saveToken(null);
      this.setState({ isExistError: true })
      console.log(error);
    }
  }

  render() {
    const { animation, dimmed, direction, visible } = this.state;
    //const vertical = direction === 'bottom' || direction === 'top'
    let token = localStorage.tokenData;
    if (token != null) {

      let _azs_check_NEED = get_list_azs_check_NEED(this.state.list_azs_check);
      let _DVC_NEED = get_DVC_NEED(this.state.DVC);

      return (
        <Router history={history}>
          <Nav handleAnimationChange={this.handleAnimationChange}
            count_AZS={(this.state.list_azs_check != null)
              ? _azs_check_NEED.length
              : 0} />

          <div className="content">
            <Sidebar.Pushable as={Segment}>

              <Filter_Sidebar_Main
                animation={animation} direction={direction}
                visible={visible} history={history} T_close={this.T_close}
                list_azs_check={this.state.list_azs_check} DVC={this.state.DVC}
              />

              <Sidebar.Pusher dimmed={dimmed && visible}>
                <Segment basic>
                  <Switch>
                    <Route exact path="/" render={({ history }) => <Main
                      history={history}
                      visible={this.state.visible}
                      list_azs_check={_azs_check_NEED}
                      DVC={_DVC_NEED}
                    />} />
                    <Route exact path="/AZS_SF" render={({ history }) => <AZS_SF
                      history={history}
                      visible={this.state.visible}
                      list_azs_check={_azs_check_NEED}
                      DVC={_DVC_NEED}
                    />} />
                    <Route exact path="/settings" render={({ history }) => <Settings history={history} />} />
                    <Route exact path="/help" render={({ history }) => <Help history={history} />} />
                    <Route exact path="/LeftPanel" render={({ history }) => <LeftPanel history={history} />} />
                    <Route exact path="/AccordPanel" render={({ history }) => <AccordPanel history={history} />} />
                    <Route exact path="/AZS_Edit" render={({ history }) => <AZS_Edit history={history} />} />
                    <Route exact path="/clean" component={CleanTOKEN} />
                    <Route exact path="/azs_listerror&*" render={(ev) => <AZS_listerror
                      history={this.props.history} azs_id={ev.match.params[0]} _List_Objs={this.state._List_Objs} />} />
                    <Route exact component={NotFound} />
                  </Switch>
                </Segment>
              </Sidebar.Pusher>

            </Sidebar.Pushable>
          </div>
        </Router>
      );
    } else {
      return (
        <W_Login history={history} />
      );
    }
  }
}
