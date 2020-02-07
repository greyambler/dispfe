import React from 'react';

import { get_Num, getColor_Crit, POST } from '../../core/core_Function.jsx'
import { Stage, Layer, Rect, Text, Line, Circle, Shape, Image } from 'react-konva';
import Konva from "konva";

import AZS_Image from '../AZS_Image.jsx'
import { Button, Icon } from 'semantic-ui-react';

const _Debuge_Message = true;


export default class tso_Head extends React.Component {
    constructor(props) {
        super(props);

        this.get_LockOrNot = this.get_LockOrNot.bind(this);
        this.get_ColorText = this.get_ColorText.bind(this);
        this.get_ColorHead = this.get_ColorHead.bind(this);
        this.get_ColorImage = this.get_ColorImage.bind(this);
        this.get_Image = this.get_Image.bind(this);
        this.send_Maile = this.send_Maile.bind(this);
    }


    get_LockOrNot(el) {
        let Image = '/images/Lock.png'
        if (parseInt(el.state_shift) == 3) {
            Image = '/images/noLock.png';
        }
        return Image;
    }
    get_OffOrOn(el) {
        let Image = '/images/TSO/Off.png'
        if (parseInt(el.state_shift) == 3) {
            Image = '/images/TSO/On.png';
        }
        return Image;
    }

    get_ColorText(el) {
        return (parseInt(el.state_pl) == 1) ? 'white' : 'black';
    }
    get_ColorHead(el) {
        let crit = getColor_Crit(el.water_level);
        return (parseInt(el.state_pl) == 1)
            ?
            (
                {
                    backgroundColor: '#7CA420',
                    overflow: 'hidden'
                }
            )
            :
            (
                {
                    backgroundColor: '#E0E0E0',
                    overflow: 'hidden'
                }
            );
    }
    get_ColorImage(el) {
        return (parseInt(el.state_pl) == 1)
            ? (this.get_Image(el))
            : ('/images/TSO/TSO0.png');
    }
    get_Image(el) {
        switch (el.water_level) {
            case 1: { return '/images/TSO/PL_FullNorm.png'; }//{ _background = 'white'; break; }
            case 2: { return '/images/TSO/PL_FullNormMinWater.png'; }//{ _background = 'yellow'; break; }
            case 3: { return '/images/TSO/PL_MaxWater.png'; }//{ _background = 'hotpink'; break; }
            default: { return '/images/TSO/PL_FullNorm.png'; } // = 'white';
        }

        //return '/images/PL/PL_FullNorm.png';
    }

    async toock(el) {///Отправка команды
        let rss = POST;
        var myRequest = new Request(rss);

       

        
    }
    send_Maile(_object, message) {
        let M = "Тест тело сообщения\n\r" + message;
        var link = "mailto:me@example.ru"
            //+ "?cc=myCCaddress@example.com"
            + "&subject=" + _object
            + "&body=" + M
            /*    + "&body=" + message
    
               + "?cc=myCCaddress@example.com"
               + "&subject=" + escape("This is my subject")
               + "&body=" + escape(document.getElementById('myText').value)
               */
            ;
        window.location.href = link;
    }

    render() {
        let S_width = 120;
        let S_height = 182;

        let text = get_Num(this.props.el);

        return (
            <center>
                <Stage width={S_width} height={S_height} style={this.get_ColorHead(this.props.el)}>
                    <Layer>

                        <Text x={2} y={5} text={text} fontSize={10} fill={this.get_ColorText(this.props.el)} />

                        <Rect x={1} y={20} width={S_width - 3} height={S_height - 22} fill={'white'} />

                        <AZS_Image Image={this.get_ColorImage(this.props.el)}
                            _W='50' _H='110' _X={35} _Y={23} />

                        <AZS_Image Image={this.get_OffOrOn(this.props.el)}
                            _W='30' _H='30' _X={5} _Y={S_height - 35} />

                        <AZS_Image Image={this.get_LockOrNot(this.props.el)} on_Click={this.toock}
                            el={this.props.el}
                            _W='30' _H='30' _X={44} _Y={S_height - 35} />

                        <AZS_Image Image='/images/mail.png' on_Click={this.send_Maile}
                            _W='30' _H='30' _X={83} _Y={S_height - 35} />

                    </Layer>
                </Stage>
            </center>
        );
    }
}