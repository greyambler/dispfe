import _ from 'lodash'
import React, { Component, PropTypes } from 'react';
import ReactTable from "react-table";

//import { Get_RSS, RSS_AZS, RSS_AZS_EDIT, Get_Val, createGuid, set_Curent_Login, get_KeyHead } from '../../core/core_Function.jsx';
import W_row_tr from './row_TR.jsx';
import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';


function m_alert(text) {
   return(
      alert(text)
   );
}


export default class edit_azs extends Component {
   constructor(props) {
      super(props);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
         id: this.props.Data[10]['id'],
         iid: this.props.Data[10]['iid'],
         dispname: this.props.Data[10]['dispname'],
         th_code: this.props.Data[10]['th_code'],
         order_num: this.props.Data[10]['order_num'],
         shortname: this.props.Data[10]['shortname'],
         region_code: this.props.Data[10]['region_code'],
         region_name: this.props.Data[10]['region_name'],
         address: this.props.Data[10]['address'],
         telefon: this.props.Data[10]['telefon'],
         _ANS: null,

      }
   }
   componentDidMount() {
      this.setState({
         id: this.props.Data[10]['id'],
         iid: this.props.Data[10]['iid'],
         dispname: this.props.Data[10]['dispname'],
         th_code: this.props.Data[10]['th_code'],
         order_num: this.props.Data[10]['order_num'],
         shortname: this.props.Data[10]['shortname'],
         region_code: this.props.Data[10]['region_code'],
         region_name: this.props.Data[10]['region_name'],
         address: this.props.Data[10]['address'],
         telefon: this.props.Data[10]['telefon'],
      });
   }
   componentDidUpdate(prevProps) {
      if (this.props.Data != prevProps.Data) {
         this.setState({
            id: this.props.Data[10]['id'],
            iid: this.props.Data[10]['iid'],
            dispname: this.props.Data[10]['dispname'],
            th_code: this.props.Data[10]['th_code'],
            order_num: this.props.Data[10]['order_num'],
            shortname: this.props.Data[10]['shortname'],
            region_code: this.props.Data[10]['region_code'],
            region_name: this.props.Data[10]['region_name'],
            address: this.props.Data[10]['address'],
            telefon: this.props.Data[10]['telefon'],
         });
      }
   }
   handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      switch (name) {
         case "shortname": {
            if (value.length <= 5) {
               this.setState({ [name]: value });
            }
            break;
         }
         default: {
            this.setState({ [name]: value });
            break;
         }
      }
   }

   async handleSubmit(event) {

      if (this.state.iid != undefined && this.state.iid != 0
         && this.state.dispname != undefined && this.state.dispname != ""
         && this.state.shortname != undefined && this.state.shortname != "") {
         let OB = {
            'id': this.state.id,
            'iid': this.state.iid,
            'dispname': this.state.dispname,
            'th_code': this.state.th_code,
            'order_num': this.state.order_num,
            'shortname': this.state.shortname,
            'region_code': this.state.region_code,
            'region_name': this.state.region_name,
            'address': this.state.address,
            'telefon': this.state.telefon
         }
         let _s = await this.props.main_Creat(JSON.stringify(OB), this.props.isCopy, event);
         this.props.onClose();
      } else {

         let msg ="";
         if(this.state.iid == undefined || this.state.iid == 0){
            msg = "Не заполнено поле 'индекс'.";
         }
         if(this.state.dispname == undefined || this.state.dispname == 0){
            msg = msg + "Не заполнено поле 'Название объекта'.";
         }
         if(this.state.shortname == undefined || this.state.shortname == 0){
            msg = msg + "Не заполнено поле 'Название'.";
         }
         event.preventDefault();
         this.props.open_Modal1(msg);
      }

      //event.preventDefault();
   }


   render() {
      const { open, size } = this.state
      if (this.props.Data != null) {
         return (
            <div>
               <form onSubmit={this.handleSubmit} onReset={this.props.onClose}>
                  <table>
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
         );
      } else {
         return <div>
            <h3>Нет данных</h3>
         </div>
      }
   }
}

