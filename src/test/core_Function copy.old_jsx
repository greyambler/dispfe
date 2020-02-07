
const IP_Server = "http://172.23.16.18:8080";

export const RSS_List_Main = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.dic"
export const RSS_AZS = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.azk";
export const RSS_LOGIN = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.dic.edit/user/login";
export const RSS_AZS_EDIT = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.dic.edit/azk";

export const WS = "ws://172.23.16.18:8080/dpsock-1.0-SNAPSHOT/alwsc";

export let Curent_Login = "";


function Get_MainHead_OP(op) {
    if (op != null) {
        let OP = new Array();
        for (const iterator of op) {
            OP[iterator.val] = iterator.text;
        }
        return OP;
    } else {
        return null;
    }
}
function Get_MainHead_CNTYP(item_pros, item, isDVC) {
    let type = item.typ;
    if (item.cntyp != null) {

        for (const _item of item.cntyp) {
            let OP = Get_MainHead_OP(_item.def.op);
            item_pros.push({
                ID: 0,
                isMain: false, main_type: type, type: "cntyp",
                key: _item.typ, key_value: _item.def.nm, isDVC: isDVC, OP: OP
            });
        }
    }
}
function Get_MainHead_dvctyptree(item_pros, item) {
    let type = item.typ;
    if (item.dvctyptree != undefined) {

        for (const _item of item.dvctyptree) {
            for (const key in _item) {
                if (key == "nm" || key == "id" || key == "typ") {

                    item_pros.push({
                        ID: 0,
                        isMain: true, main_type: type, type: _item.typ,
                        key: key, key_value: _item[key], isDVC: true
                    });
                }
            }
            Get_MainHead_CNTYP(item_pros, _item, true);
        }
    }
}
function SET_MainHead(item, item_pros) {
    let type = item.typ;
    for (const key in item) {
        if (key == "nm" || key == "id" || key == "typ") {
            let VALUE = '-----';
            /**/
            if (key == "id") {
                item_pros.push({
                    ID: 0,
                    isMain: true, main_type: 'NULL', type: 'NULL',
                    key: 'NULL', key_value: '|', isDVC: false, value: VALUE
                });
            }
            item_pros.push({
                ID: 0,
                isMain: true, main_type: type, type: type,
                key: key, key_value: item[key], isDVC: false, value: VALUE
            });
        }
    }
    Get_MainHead_CNTYP(item_pros, item, false);
    Get_MainHead_dvctyptree(item_pros, item);
    return item_pros;
}
function set_AZS_name(BOOK_All) {
    /*** строки для приема данных названия азс ****************/
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'NULL', type: 'NULL',
        key: "NULL", key_value: '|', isDVC: false, value: "-----"
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "id", key_value: 0, isDVC: false, value: "-----"
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "typ", key_value: "ob", isDVC: false, value: "-----"
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "nm", key_value: "АЗК", isDVC: false, value: "-----"
    });
}
export function Get_Main_PROPS(List_Main) {
    let BOOK_All = new Array();
    if (List_Main != null) {
        set_AZS_name(BOOK_All);

        for (const iterator of List_Main) {
            if (iterator.typ == "pl" ||
                iterator.typ == "pump" ||
                iterator.typ == "tso") {
                SET_MainHead(iterator, BOOK_All);
            }
        }
    }
    return BOOK_All;
}

function Get_MAX_COL(mass_DVC) {
    let CountMax = new Array();
    for (const iterator of mass_DVC) {
        if (iterator.typ == "pl" || iterator.typ == "pump" || iterator.typ == "tso") {
            if (CountMax[iterator.typ] == null) {
                CountMax[iterator.typ] = 1;
            } else {
                CountMax[iterator.typ] = CountMax[iterator.typ] + 1;
            }
        }
    }
    let max_Col = 1;
    for (const key in CountMax) {
        if (max_Col < CountMax[key]) {
            max_Col = CountMax[key];
        }
    }
    return max_Col;
}
function GET_AZS_name(BOOK_All, azs, max_Col) {
    /*** строки для приема данных названия азс ****************/
    BOOK_All.push({
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'NULL', type: 'NULL',
        key: "NULL", key_value: "|", isDVC: false, value: "-----"
    });
    BOOK_All.push({
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "id", key_value: azs.id, isDVC: false, value: "-----"
    });
    BOOK_All.push({
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "typ", key_value: azs.ob, isDVC: false, value: "-----"
    });
    BOOK_All.push({
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "nm", key_value: azs.nm, isDVC: false, value: "-----"
    });
}
export function Get_Main_PROPS_AZS(azs, mass_DVC, List_Main) {
    let BOOK_All = new Array();
    if (azs != null && mass_DVC != null) {
        let max_Col = Get_MAX_COL(mass_DVC);
        GET_AZS_name(BOOK_All, azs, max_Col);

        let C_PL = 0;
        let C_PUMP = 0;
        let C_TSO = 0;
        let list_PL = null;
        let list_PUMP = null;
        let list_TSO = null;
        for (const iterator of List_Main) {
            if (iterator.typ == "pl") {
                list_PL = iterator;
            }
            if (iterator.typ == "pump") {
                list_PUMP = iterator;
            }
            if (iterator.typ == "tso") {
                list_TSO = iterator;
            }
        }
        for (const iterator of mass_DVC) {
            switch (iterator.typ) {// тк нужно по каждому типу устройств max_Col колонок... иначе рвется разметка по вертикали.
                case "pl": {
                    C_PL++;
                    Get_PL(BOOK_All, iterator, azs.id, list_PL);
                    break;
                }
                case "pump": {
                    C_PUMP++
                    Get_PL(BOOK_All, iterator, azs.id, list_PUMP);
                    break;
                }
                case "tso": {
                    C_TSO++;
                    Get_PL(BOOK_All, iterator, azs.id, list_TSO);
                    break;
                }
            }

            //Get_MainHead_AZS(BOOK_All, iterator, azs.id, max_Col);
        }
        GET_N_PL(BOOK_All, C_PL, max_Col, azs.id);
        GET_N_PUMP(BOOK_All, C_PUMP, max_Col, azs.id);
        GET_N_TSO(BOOK_All, C_TSO, max_Col, azs.id);
    }
    return BOOK_All;
}

/** PL *************** */
function Get_PL(BOOK_All, item_DVC, azs_ID, list_Main) {
    for (const key in item_DVC) {
        if (key == "nm" || key == "id" || key == "typ") {
            let VALUE = '-----';
            BOOK_All.push({
                ID: azs_ID,
                isMain: true, main_type: item_DVC.typ, type: item_DVC.typ,
                key: key, key_value: item_DVC[key], isDVC: false, value: VALUE
            });
        }
    }
    Get_MainHead_CNTYP_PL(BOOK_All, false, azs_ID, list_Main);
    Get_MainHead_dvctyptree_PL(BOOK_All, azs_ID, list_Main);

}
function Get_MainHead_CNTYP_PL(BOOK_All, isDVC, azs_ID, list_Main) {
    let type = list_Main.typ;
    if (list_Main.cntyp != null) {
        for (const _item of list_Main.cntyp) {
            let OP = Get_MainHead_OP(_item.def.op);
            BOOK_All.push({
                ID: azs_ID,
                isMain: false, main_type: type, type: "cntyp",
                key: _item.typ, key_value: "---", isDVC: isDVC, OP: OP
            });
        }
    }
}
function Get_MainHead_dvctyptree_PL(BOOK_All, azs_ID, list_Main) {
    let type = list_Main.typ;
    if (list_Main.dvctyptree != undefined) {
        for (const _item of list_Main.dvctyptree) {
            for (const key in _item) {
                if (key == "nm" || key == "id" || key == "typ") {

                    BOOK_All.push({
                        ID: azs_ID,
                        isMain: true, main_type: type, type: _item.typ,
                        key: key, key_value: _item[key], isDVC: true
                    });
                }
            }
            Get_MainHead_CNTYP(BOOK_All, _item, true);
        }
    }
}
function GET_N_PL(BOOK_All, CurentCOL, max_Col, azs_ID) {

    for (let index = CurentCOL; index < max_Col; index++) {
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "pl", type: "pl",
            key: "id", key_value: "", isDVC: false, value: "-----"
        });
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "pl", type: "pl",
            key: "typ", key_value: "", isDVC: false, value: "-----"
        });
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "pl", type: "pl",
            key: "nm", key_value: "", isDVC: false, value: "-----"
        });
    }
}
/** PL *************** */



/** PUMP *************** */
function GET_N_PUMP(BOOK_All, CurentCOL, max_Col, azs_ID) {

    for (let index = CurentCOL; index < max_Col; index++) {
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "pump", type: "pump",
            key: "id", key_value: "", isDVC: false, value: "-----"
        });
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "pump", type: "pump",
            key: "typ", key_value: "", isDVC: false, value: "-----"
        });
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "pump", type: "pump",
            key: "nm", key_value: "", isDVC: false, value: "-----"
        });
    }
}
/** PUMP *************** */
/** TSO *************** */
function GET_N_TSO(BOOK_All, CurentCOL, max_Col, azs_ID) {

    for (let index = CurentCOL; index < max_Col; index++) {
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "tso", type: "tso",
            key: "id", key_value: "", isDVC: false, value: "-----"
        });
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "tso", type: "tso",
            key: "typ", key_value: "", isDVC: false, value: "-----"
        });
        BOOK_All.push({
            ID: azs_ID,
            isMain: true, main_type: "tso", type: "tso",
            key: "nm", key_value: "", isDVC: false, value: "-----"
        });
    }
}
/** TSO *************** */




/**/
//Get_MainHead_CNTYP_AZS(item_pros, item, false, azs);
//    Get_MainHead_dvctyptree_AZS(item_pros, item, azs);

/*

function Get_MainHead_AZS(BOOK_All, item_DVC, azs_ID, max_Col) {
    //let type = item_DVC.typ;

    for (const key in item_DVC) {
        if (key == "nm" || key == "id" || key == "typ") {
            let VALUE = '-----';
            BOOK_All.push({
                ID: azs_ID,
                isMain: true, main_type: item_DVC.typ, type: item_DVC.typ,
                key: key, key_value: item_DVC[key], isDVC: false, value: VALUE
            });
        }
    }
    //Get_MainHead_CNTYP_AZS(item_pros, item, false, azs);
    //    Get_MainHead_dvctyptree_AZS(item_pros, item, azs);

}
function Get_MainHead_CNTYP_AZS(item_pros, item, isDVC, azs) {
    let type = item.typ;
    if (item.cntyp != null) {

        for (const _item of item.cntyp) {
            let OP = Get_MainHead_OP(_item.def.op);
            item_pros.push({
                ID: azs.id,
                isMain: false, main_type: type, type: "cntyp",
                key: _item.typ, key_value: _item.def.nm, isDVC: isDVC, OP: OP
            });
        }
    }
}
function Get_MainHead_dvctyptree_AZS(item_pros, item, azs) {
    let type = item.typ;
    if (item.dvctyptree != undefined) {

        for (const _item of item.dvctyptree) {
            for (const key in _item) {
                if (key == "nm" || key == "id" || key == "typ") {

                    item_pros.push({
                        ID: azs.id,
                        isMain: true, main_type: type, type: _item.typ,
                        key: key, key_value: _item[key], isDVC: true
                    });
                }
            }
            Get_MainHead_CNTYP(item_pros, _item, true);
        }
    }
}

*/

export function refreshPage() {
    window.location.reload();
}

export function WhatKeyNotShow(key) {
    if (key == 'id' || key == 'typ') {
        return false;
    }
    else {
        return true;
    }
}

export function set_Curent_Login(_Curent_Login) {
    return Curent_Login = _Curent_Login;
}
export function get_Curent_Login() {
    if (Curent_Login != null) {
        return Curent_Login.substring(0, 18);
    } else {
        return "";
    }
}

export function demoAsyncCall() {
    return new Promise((resolve) => setTimeout(() => resolve(), 500));
}

export function Get_MainHead_save(item) {
    let item_pros = new Array();
    for (const key in item) {
        if (key == "nm" || key == "id" || key == "typ") {
            item_pros.push({ code: key, name: item[key], value: "" });
        }
    }
    if (item.cntyp != undefined) {
        for (const _item of item.cntyp) {
            item_pros.push({ code: _item.typ, name: _item.def.nm, value: "" });
        }
    }
    return item_pros;
}
export function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function saveToken(token, login) {
    if (token == null) {
        localStorage.removeItem('tokenData');
        //localStorage.clear()
        //let wr = localStorage.tokenData;
        //let rrrr = 0;
    } else {
        let tokenData = login + "!^!" + token;
        localStorage.setItem('tokenData', tokenData);
    }
}