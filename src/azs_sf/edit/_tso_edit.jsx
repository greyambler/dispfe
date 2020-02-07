import _ from 'lodash'
import React, { Component, PropTypes } from 'react';
import ReactTable from "react-table";
import W_row_tr from './row_TRPL.jsx';
import { Button, Header, Image, Modal, Input, Container } from 'semantic-ui-react';


function m_alert(text) {
   return (
      alert(text)
   );
}


export default class _tso_edit extends Component {
   constructor(props) {
      super(props);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
         "id": "00000000-0000-0000-0000-000000000000",
         "nm": this.props.Data.nm,
         "name": this.props.Data.name,
         "V": this.props.Data.V,
         "MaxV": this.props.Data.MaxV,
         "Vq": this.props.Data.Vq,
         "minV": this.props.Data.minV,
         "maxVM": this.props.Data.maxVM,
         _ANS: null,
      }
   }
   componentDidMount() {
      this.setState({
         id: this.props.Data.id,
         "nm": this.props.Data.nm,
         "name": this.props.Data.name,
         "V": this.props.Data.V,
         "MaxV": this.props.Data.MaxV,
         "Vq": this.props.Data.Vq,
         "minV": this.props.Data.minV,
         "maxVM": this.props.Data.maxVM,
      });
   }
   componentDidUpdate(prevProps) {
      if (this.props.Data != prevProps.Data) {
         this.setState({
            id: this.props.Data.id,
            "nm": this.props.Data.nm,
            "name": this.props.Data.name,
            "V": this.props.Data.V,
            "MaxV": this.props.Data.MaxV,
            "Vq": this.props.Data.Vq,
            "minV": this.props.Data.minV,
            "maxVM": this.props.Data.maxVM,
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
            "nm": this.props.Data.nm,
            "name": this.props.Data.name,
            "V": this.props.Data.V,
            "MaxV": this.props.Data.MaxV,
            "Vq": this.props.Data.Vq,
            "minV": this.props.Data.minV,
            "maxVM": this.props.Data.maxVM,
         }
         let _s = await this.props.main_Creat(JSON.stringify(OB), this.props.isCopy, event);
         this.props.onClose(_s);
      } else {

         let msg = "";
         if (this.state.iid == undefined || this.state.iid == 0) {
            msg = "Не заполнено поле 'индекс'.";
         }
         if (this.state.dispname == undefined || this.state.dispname == 0) {
            msg = msg + "Не заполнено поле 'Название объекта'.";
         }
         if (this.state.shortname == undefined || this.state.shortname == 0) {
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
                        {/*<W_row_tr name='id' type="guid" value={this.state.id} handleInputChange={this.handleInputChange} />
                        <W_row_tr name='iid' type="number" value={this.state.iid} handleInputChange={this.handleInputChange} />*/}

                        <W_row_tr name='nm' type="text" value={this.state.nm} handleInputChange={this.handleInputChange} />
 {/*                       <W_row_tr name='name' type="number" value={this.state.name} handleInputChange={this.handleInputChange} />
                         <W_row_tr name='V' type="number" value={this.state.V} handleInputChange={this.handleInputChange} />
                        <W_row_tr name='MaxV' type="text" value={this.state.MaxV} handleInputChange={this.handleInputChange} />
                        <W_row_tr name='Vq' type="number" value={this.state.Vq} handleInputChange={this.handleInputChange} />
                        <W_row_tr name='minV' type="text" value={this.state.minV} handleInputChange={this.handleInputChange} />
                        <W_row_tr name='maxVM' type="text" value={this.state.maxVM} handleInputChange={this.handleInputChange} />
 */}

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

