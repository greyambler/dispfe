import { isArray } from "util";

const _Release = false;
export const _IS_NEW = true;  // true  false

const IP_Server = (_Release)
    ? "http://" + window.location.host
    : "http://172.23.16.18:8080";
//const IP_Server = "http://" + window.location.host;

export const RSS_List_Main = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.dic"
export const RSS_AZS = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.azk";
export const RSS_LOGIN = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.dic.edit/user/login";
export const RSS_AZS_EDIT = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.dic.edit/azk";

export const WS = (_Release)
    ? "ws://" + window.location.host + "/dpsock-1.0-SNAPSHOT/alwsc"
    : "ws://172.23.16.18:8080/dpsock-1.0-SNAPSHOT/alwsc";
//export const WS = "ws://" + window.location.host + "/dpsock-1.0-SNAPSHOT/alwsc";

export const POST = IP_Server + "/dprest-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpfacade.com";
export const AZS_List_Error = IP_Server + "/dpmark-1.0-SNAPSHOT/webresources/ru.expertek.dp.dpinside.mark";


export let Curent_Login = "";

/** справочник */
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

            if (item.nm == "Купюроприёмник") {
                let r = 0;
            }


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
            if (type != "pump") {
                for (const key in _item) {
                    if (key == "nm" || key == "id" || key == "typ") {

                        if (_item[key] == "Купюроприёмник") {
                            let r = 0;
                        }

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
}
function SET_MainHead(item, item_pros) {
    let type = item.typ;
    for (const key in item) {
        if (key == "nm" || key == "id" || key == "typ") {
            if (key == "id") {
                item_pros.push({
                    ID: 0,
                    isMain: true, main_type: 'NULL', type: 'NULL',
                    key: 'NULL', key_value: "_", isDVC: false
                });
            }
            item_pros.push({
                ID: 0,
                isMain: true, main_type: type, type: type,
                key: key, key_value: item[key], isDVC: false
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
        key: "NULL", key_value: " ", isDVC: false
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "id", key_value: 0, isDVC: false
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "typ", key_value: "ob", isDVC: false
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "nm", key_value: " ", isDVC: false
    });
}

export function Get_Main_PROPS(List_Main, DVC) {
    let BOOK_All = new Array();
    if (List_Main != null) {
        set_AZS_name(BOOK_All);
        for (const iterator of List_Main) {
            for (const dvc of DVC) {
                if (dvc.typ == iterator.typ) {
                    SET_MainHead(iterator, BOOK_All);
                    break;
                }
            }
        }
    }
    return BOOK_All;
}

/** справочник Single*/

/***********Начальная колонка ******************** */

/**/
export function Get_PROPS_Single(List_Main, TYPE, val_0) {
    let BOOK_All = new Array();
    if (List_Main != null) {
        for (const iterator of List_Main) {
            if (iterator.typ == "tso") {
                Get_dvctyp_Single(BOOK_All, iterator, TYPE, val_0); // TREE fr....
            }
            if (iterator.typ == TYPE) {
                Get_CNTYP_Single(BOOK_All, iterator, false);
            }
        }
    }
    if (val_0) {
        for (const iterator of BOOK_All) {
            iterator.key_value = " ---- ";
        }
    }
    return BOOK_All;
}

function Get_dvctyp_Single(item_pros, item, TYPE) {
    if (item.dvctyptree != undefined) {
        for (const iterator of item.dvctyptree) {
            if (iterator.typ == TYPE) {
                Get_CNTYP_Single(item_pros, iterator, false);
            }
        }
    }
}

function Get_CNTYP_Single(item_pros, item, isDVC) {
    let type = item.typ;
    if (item.cntyp != null) {

        for (const _item of item.cntyp) {
            let OP = Get_MainHead_OP(_item.def.op);
            item_pros.push({
                ID: 0,
                isMain: false, main_type: type, type: "cntyp",
                key: _item.typ, key_value: _item.def.nm, isDVC: isDVC, OP: OP, crit: " ",
            });
        }
    }
}
function Get_dvctyptree_Single(item_pros, item) {

    let type = item.typ;
    if (item.dvctyptree != undefined) {

        for (const _item of item.dvctyptree) {
            if (type != "pump") {
                for (const key in _item) {
                    if (key == "nm") {// || key == "id" || key == "typ") {

                        //if (_item[key] == "Купюроприёмник") {
                        //    let r = 0;
                        // }

                        item_pros.push({
                            ID: 0,
                            isMain: true, main_type: type, type: _item.typ,
                            key: key, key_value: _item[key], isDVC: true, crit: " ",
                        });
                    }
                }
                //Get_CNTYP_Single(item_pros, _item, true);
            }
        }
    }
}

/***********Начальная колонка ******************** */



function set_AZS_name_Single(BOOK_All) {
    /*** строки для приема данных названия азс ****************/
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'NULL', type: 'NULL',
        key: "NULL", key_value: " ", isDVC: false,
        crit: " ", dvc_id: "NULL", dvc_id_m: "NULL"
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "id", key_value: 0, isDVC: false,
        crit: " ", dvc_id: "NULL", dvc_id_m: "NULL"
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "typ", key_value: "ob", isDVC: false,
        crit: " ", dvc_id: "NULL", dvc_id_m: "NULL"
    });
    BOOK_All.push({
        ID: 0,
        ColSpan: 2,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "nm", key_value: " ", isDVC: false,
        crit: " ", dvc_id: "NULL", dvc_id_m: "NULL"
    });
}
function SET_MainHead_Single(item, item_pros) {
    let type = item.typ;
    for (const key in item) {
        if (key == "nm" || key == "id" || key == "typ") {
            if (key == "id") {
                item_pros.push({
                    ID: 0,
                    isMain: true, main_type: 'NULL', type: 'NULL',
                    key: 'NULL', key_value: "_", isDVC: false, crit: " ",
                });
            }
            item_pros.push({
                ID: 0,
                isMain: true, main_type: type, type: type,
                key: key, key_value: item[key], isDVC: false, crit: " ",
            });
        }
    }
    /* 
    Get_MainHead_CNTYP(item_pros, item, false);
    */
    Get_dvctyptree_Single(item_pros, item);

    return item_pros;
}
export function Get_FIRST_COLL_Single(List_Main, DVC) {
    let BOOK_All = new Array();
    if (List_Main != null) {
        set_AZS_name_Single(BOOK_All);
        for (const iterator of List_Main) {
            for (const dvc of DVC) {
                if (dvc.typ == iterator.typ) {
                    SET_MainHead_Single(iterator, BOOK_All);
                    break;
                }
            }
        }
    }
    return BOOK_All;
}


function Get_DVC_Single(BOOK_All, item_DVC, azs_ID, MAIN_TYPE) {

    if (item_DVC.nm != null && item_DVC.id != null && item_DVC.typ != null) {
        //if (item_DVC.fuel != null) {
        //    let r = 0;
        //}
        let MassID = null;
        if (item_DVC.typ == "tso" && item_DVC.devices != null) {
            MassID = new Array();
            for (const iterator of item_DVC.devices) {
                MassID.push(iterator.id);
            }
        }

        BOOK_All.push({
            dvc_id: item_DVC.id,
            dvc_id_m: MassID,
            //devices_m: item_DVC.devices,
            ID: azs_ID,
            fuel: item_DVC.fuel,

            state_pl: 0,
            water_level: 0,
            state_shift: 0,
            state_trk: 0,

            isMain: true, main_type: (MAIN_TYPE == undefined) ? item_DVC.typ : MAIN_TYPE, type: item_DVC.typ,
            key: "nm", key_value: item_DVC.nm, isDVC: false, crit: " ",
        });

    }

}
function SET_ZERO_TD_N_N_DVC_Single(BOOK_All, CurentCOL, max_Col, azs_ID, N_DVC, list) {

    for (let index = CurentCOL; index < max_Col; index++) {
        BOOK_All.push({
            dvc_id: list.id,
            ID: azs_ID,

            isMain: true, main_type: N_DVC, type: N_DVC,
            key: "nm", key_value: "", isDVC: false, crit: " ",
        });

    }
}

export function Get_Main_PROPS_AZS_Single(azs, mass_DVC, List_Main) {
    let BOOK_All = new Array();
    if (azs != null && mass_DVC != null) {// && mass_DVC.length > 0) {
        let max_Col = Get_MAX_COL(mass_DVC);
        GET_AZS_name(BOOK_All, azs, max_Col, mass_DVC);

        let C_PL = 0;
        let C_PUMP = 0;
        let C_TSO = 0;



        let list_PL_col = get_Lists(List_Main, "pl");
        let list_PUMP_col = get_Lists(List_Main, "pump");
        let list_TSO_col = get_Lists(List_Main, "tso");

        /* let list_FR_col = get_Lists(List_Main, "fr");


               let list_CASH_col = get_Lists(List_Main, "cash");
                let list_TD_col = get_Lists(List_Main, "td");
                let list_MSC_col = get_Lists(List_Main, "msc");
                let list_CMD_MFC_col = get_Lists(List_Main, "cmd_mfc");
         */

        let mass_d_tree = new Array();

        for (const iterator of mass_DVC) {
            switch (iterator.typ) {// тк нужно по каждому типу устройств max_Col колонок... иначе рвется разметка по вертикали.
                case "pl": {
                    if (list_PL_col != null) {
                        C_PL++;
                        Get_DVC_Single(BOOK_All, iterator, azs.id);//, list_PL_col);
                    }
                    break;
                }
                case "pump": {
                    if (list_PUMP_col != null) {
                        C_PUMP++
                        Get_DVC_Single(BOOK_All, iterator, azs.id);//, list_PUMP_col);
                    }
                    break;
                }
                case "tso": {
                    if (list_TSO_col != null) {
                        C_TSO++;
                        Get_DVC_Single(BOOK_All, iterator, azs.id);//, list_TSO_col);

                        if (list_TSO_col != null && iterator.devices != undefined) { // заполнить данными по dvctyptree
                            for (const item_Main of iterator.devices) {
                                mass_d_tree.push({ type: item_Main.typ, n: 1 });
                                Get_DVC_Single(BOOK_All, item_Main, azs.id, "tso");
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (list_PL_col != null) {
            SET_ZERO_TD_N_N_DVC_Single(BOOK_All, C_PL, max_Col, azs.id, "pl", list_PL_col);
        }
        if (list_PUMP_col != null) {
            SET_ZERO_TD_N_N_DVC_Single(BOOK_All, C_PUMP, max_Col, azs.id, "pump", list_PUMP_col);
        }
        if (list_TSO_col != null) {
            SET_ZERO_TD_N_N_DVC_Single(BOOK_All, C_TSO, max_Col, azs.id, "tso", list_TSO_col);
        }

        if (list_TSO_col != null && list_TSO_col.dvctyptree != undefined) { // заполнить данными по dvctyptree
            Get_DVC_TREE_Single(BOOK_All, max_Col, azs.id, list_TSO_col.dvctyptree, mass_d_tree);
        }
    }
    return BOOK_All;
}


function Get_DVC_TREE_Single(BOOK_All, max_Col, azs_ID, List_Main, mass_d_tree) {
    for (const item_Main of List_Main) {
        let list = get_Lists(List_Main, item_Main.typ);

        let Coll_Type = 0;
        for (const _item of mass_d_tree) {
            if (item_Main.typ == _item.type) {
                Coll_Type++;
            }
        }
        SET_ZERO_TD_N_N_DVC_Single(BOOK_All, Coll_Type, max_Col, azs_ID, item_Main.typ, list);
    }
}


/** справочник Single*/

/** справочник */

export function Get_RSS(Rss, startDate, endDate) {
    var rss = Rss;

    if (startDate != null && endDate != null) {
        let IsOne = D1_D1_Eq_moment(startDate, endDate);
        if (IsOne) {
            rss = rss + "?date=" + GetDateYMD_moment(startDate);
        }
        else {
            rss = rss + "?from="
                + GetDateYMD_moment(startDate)
                + "&to="
                + GetDateYMD_moment(endDate);
        }
    }
    return rss;
}
export function D1_D1_Eq_moment(_M1, _M2) {
    if (_M1 != null && _M2 != null) {
        try {
            var d1 = _M1.date();
            var m1 = _M1.month();
            var y1 = _M1.year();

            var d2 = _M2.date();
            var m2 = _M2.month();
            var y2 = _M2.year();

            if ((y1 == y2) && (m1 == m2) && (d1 == d2)) {
                return true;
            }
        }
        catch{ }
    }
    return false;
}
export function GetDateYMD_moment(_moment) {
    if (_moment != null) {
        var day = _moment.date();
        var month = _moment.month() + 1;
        var year = _moment.year();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        var today = year + "-" + month + "-" + day;

        return today;
    }
    else {
        return GetDateNow();
    }
}

export function GetDateNow() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    return today;
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
function GET_AZS_name(BOOK_All, azs, max_Col, mass_DVC) {
    /*** строки для приема данных названия азс ****************/
    BOOK_All.push({
        dvc_id: "",
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'NULL', type: 'NULL',
        key: "NULL", key_value: " ", isDVC: false
    });
    BOOK_All.push({
        dvc_id: "",
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "id", key_value: azs.id, isDVC: false, mass_DVC: mass_DVC
    });
    BOOK_All.push({
        dvc_id: "",
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "typ", key_value: azs.ob, isDVC: false
    });
    BOOK_All.push({
        dvc_id: "",
        ID: azs.id,
        ColSpan: max_Col,
        isMain: true, main_type: 'azs', type: 'azs',
        key: "nm", key_value: azs.nm, isDVC: false
    });
}
function get_Lists(List_Main, type, List_Main_TSO) {
    let list = null;
    for (const iterator of List_Main) {
        if (iterator.typ == type) {
            list = iterator;
            break;
        }
    }
    return list;
}
export function Get_Main_PROPS_AZS(azs, mass_DVC, List_Main) {
    let BOOK_All = new Array();
    if (azs != null && mass_DVC != null) {
        let max_Col = Get_MAX_COL(mass_DVC);
        GET_AZS_name(BOOK_All, azs, max_Col, mass_DVC);

        let C_PL = 0;
        let C_PUMP = 0;
        let C_TSO = 0;

        let list_PL_col = get_Lists(List_Main, "pl");
        let list_PUMP_col = get_Lists(List_Main, "pump");

        let list_TSO_col = get_Lists(List_Main, "tso");

        for (const iterator of mass_DVC) {
            switch (iterator.typ) {// тк нужно по каждому типу устройств max_Col колонок... иначе рвется разметка по вертикали.
                case "pl": {
                    if (list_PL_col != null) {
                        C_PL++;
                        Get_DVC(BOOK_All, iterator, azs.id, list_PL_col);
                    }
                    break;
                }
                case "pump": {
                    if (list_PUMP_col != null) {
                        C_PUMP++
                        Get_DVC(BOOK_All, iterator, azs.id, list_PUMP_col);
                    }
                    break;
                }
                case "tso": {
                    if (list_TSO_col != null) {
                        C_TSO++;
                        Get_DVC(BOOK_All, iterator, azs.id, list_TSO_col);
                    }
                    break;
                }
            }

            //Get_MainHead_AZS(BOOK_All, iterator, azs.id, max_Col);
        }
        if (list_PL_col != null)
            SET_ZERO_TD_N_N_DVC(BOOK_All, C_PL, max_Col, azs.id, "pl", list_PL_col);
        if (list_PUMP_col != null)
            SET_ZERO_TD_N_N_DVC(BOOK_All, C_PUMP, max_Col, azs.id, "pump", list_PUMP_col);
        if (list_TSO_col != null)
            SET_ZERO_TD_N_N_DVC(BOOK_All, C_TSO, max_Col, azs.id, "tso", list_TSO_col);


        if (list_TSO_col != null && list_TSO_col.dvctyptree != undefined) { // заполнить данными по dvctyptree
            Get_DVC_TREE(BOOK_All, C_TSO, max_Col, azs.id, "tso", list_TSO_col.dvctyptree, mass_DVC);
        }
    }
    return BOOK_All;
}

/** dvc *************** */

function Get_DVC(BOOK_All, item_DVC, azs_ID, list_Main) {
    for (const key in item_DVC) {

        if (key == "nm" || key == "id" || key == "typ") {

            if (item_DVC.fuel != null) {
                let r = 0;
            }
            BOOK_All.push({
                dvc_id: item_DVC.id,
                ID: azs_ID,
                fuel: item_DVC.fuel,

                state_pl: 0,
                water_level: 0,
                state_shift: 0,
                state_trk: 0,



                isMain: true, main_type: item_DVC.typ, type: item_DVC.typ,
                key: key, key_value: item_DVC[key], isDVC: false
            });
        }
    }

    Get_DVC_CNTYP(BOOK_All, false, azs_ID, list_Main, item_DVC.id);

}
function Get_DVC_CNTYP(BOOK_All, isDVC, azs_ID, list_Main, item_DVC_id) {
    let type = list_Main.typ;
    if (list_Main.cntyp != null) {
        for (const _item of list_Main.cntyp) {
            let OP = Get_MainHead_OP(_item.def.op);//Массив для ответа по коду сообщения
            BOOK_All.push({
                dvc_id: item_DVC_id,
                key_value: "----",
                crit: "----",
                key: _item.typ,
                ID: azs_ID,
                isMain: false, main_type: type, type: "cntyp",
                isDVC: isDVC, OP: OP
            });
        }
    }
}
function SET_ZERO_TD_N_N_DVC(BOOK_All, CurentCOL, max_Col, azs_ID, N_DVC, list) {
    for (let index = CurentCOL; index < max_Col; index++) {
        for (const key in list) {
            BOOK_All.push({
                dvc_id: list.id,
                ID: azs_ID,

                isMain: true, main_type: N_DVC, type: N_DVC,
                key: key, key_value: "", isDVC: false
            });
        }
        if (list != null && list.cntyp != null) {
            for (const item of list.cntyp) {
                BOOK_All.push({
                    dvc_id: list.id,
                    ID: azs_ID,

                    isMain: false, main_type: N_DVC, type: "cntyp",
                    key: item.typ, key_value: "", isDVC: false
                });
            }
        }
    }
}
function Get_DVC_TREE(BOOK_All, CurentCOL, max_Col, azs_ID, main_type, List_Main, dvc_Tree) {

    for (const item_Main of List_Main) {
        for (const item_dvc of dvc_Tree) {
            let Count_Item = 0;
            if (item_dvc.typ == item_Main.typ) {

                for (const key in item_dvc) {
                    if (key == "nm" || key == "id" || key == "typ") {
                        Count_Item++;
                        BOOK_All.push({
                            dvc_id: item_dvc.id,
                            ID: azs_ID,
                            isMain: true, main_type: main_type, type: item_dvc.typ,
                            key: key, key_value: item_dvc[key], isDVC: true
                        });
                    }
                }

                let list = get_Lists(List_Main, item_dvc.typ);
                Get_DVC_CNTYP_TREE(BOOK_All, true, azs_ID, item_Main, item_dvc.id);
                if ((Count_Item / 3) != CurentCOL) {
                    CurentCOL = (Count_Item / 3);
                    let r = 0;
                }

                SET_ZERO_TD_N_N_DVC(BOOK_All, CurentCOL, max_Col, azs_ID, item_dvc.typ, list);
                break;
            }
        }
    }
    if (CurentCOL == 0) {
        for (const item_Main of List_Main) {
            let list = get_Lists(List_Main, item_Main.typ);
            SET_ZERO_TD_N_N_DVC(BOOK_All, CurentCOL, max_Col, azs_ID, item_Main.typ, list);
        }
    }
}
function Get_DVC_CNTYP_TREE(BOOK_All, isDVC, azs_ID, list_Main, item_DVC_id) {
    let type = list_Main.typ;

    if (list_Main.cntyp != null) {
        for (const _item of list_Main.cntyp) {

            let OP = Get_MainHead_OP(_item.def.op);//Массив для ответа по коду сообщения
            BOOK_All.push({
                dvc_id: item_DVC_id,
                key_value: "----",
                crit: "----",
                key: _item.typ,
                ID: azs_ID,
                isMain: false, main_type: type, type: "cntyp",
                isDVC: isDVC, OP: OP
            });
        }
    }
}

/** dvc *************** */

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
    return new Promise((resolve) => setTimeout(() => resolve(), 1500));
}
export function Get_MainHead_save(item) {
    let item_pros = new Array();
    for (const key in item) {
        if (key == "nm" || key == "id" || key == "typ") {
            item_pros.push({ code: key, name: item[key] });
        }
    }
    if (item.cntyp != undefined) {
        for (const _item of item.cntyp) {
            item_pros.push({ code: _item.typ, name: _item.def.nm });
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
    } else {
        let tokenData = login + "!^!" + token;
        localStorage.setItem('tokenData', tokenData);
    }
}
export function get_Json_String(mstring) {
    if (mstring != null) {
        let R_Mas = new Array();
        for (const m of mstring) {
            if (isArray(m)) {
                for (const item of m) {
                    R_Mas.push(item);
                }
            } else {

                R_Mas.push(m);
            }
        }

        const T_Json = JSON.stringify(R_Mas);
        return T_Json;
    } else {
        return "";
    }
}

export function get_Num(el, _Debuge_Show_Crit, _Debuge_Show_Code) {
    if (el.key_value != "----" && el.key_value != " " && el.OP != null) {
        let r = 0;
    }
    let text = el.key_value;

    let num_Text = parseInt(text);
    if (!isNaN(num_Text)) {
        if (el.key == "TOTAL_OBSERVED_VOLUME" || el.key == "PRODUCT_LEVEL") {
            text = num_Text.toFixed(2);
        } else {
            if (el.OP != null && el.OP[num_Text] != null) {
                text = el.OP[num_Text];
            }
        }
    }
    if (_Debuge_Show_Code) {
        text = text + " [" + el.key + "]";
    }
    if (_Debuge_Show_Crit && el.crit != null && el.crit != "----") {
        if (el.OP != null) {
            text = text + " [" + el.key_value + "]" + " (" + el.ID + "),(dvc_id - " + el.dvc_id + ")";
        }
        if (el.crit != "----" && el.crit != null) {
            text = text + " {" + el.crit + "}" + " (" + el.ID + "),(dvc_id - " + el.dvc_id + ")";
        }
    }


    if (el.ID != 0 && //!el.isDVC && el.isMain && el.key_value == "" &&
        (//el.type == "fr"
            //|| el.type == "cash"
            //||
            el.type == "td"
            //|| el.type == "msc"
            //|| el.type == "cash"
            || el.type == "cmd_mfc"
        )
    ) {
        let r = 0;
        //text = "--- dvc_id - " + el.dvc_id + " ID - " + el.ID;

    }


    return text;
}

export function getColor_Crit(Crit) {
    let _color = null;
    switch (Crit) {
        case 1: { _color = 'white'; break; }
        case 2: { _color = 'yellow'; break; }
        case 3: { _color = 'hotpink'; break; }
        default: { _color = 'white'; break; }
    }
    return _color;
}

export function Get_Val(mas, key, isFull) {
    let R = "";
    let len = mas.length;
    if (len > 0) {
        if (mas[len - 1][key] != null) {
            if (mas[len - 1][key].text != undefined) {
                R = mas[len - 1][key].text;
            } else {
                R = mas[len - 1][key];
            }
        }
    }
    R = isFull
        ? R
        : (R.length > 36) ? R.substr(0, 36) : R;
    return R;
}


export function get_KeyHead(key) {
    let KeyHead = '';
    switch (key) {
        case "id": { KeyHead = "id_guid"; break; }
        case "iid": { KeyHead = "индекс *"; break; }
        case "dispname": { KeyHead = "Название объекта *"; break; }
        case "th_code": { KeyHead = "TH код объекта"; break; }
        case "order_num": { KeyHead = "Номер объекта"; break; }
        case "shortname": { KeyHead = "Название *"; break; }
        case "region_code": { KeyHead = "Код региона"; break; }
        case "region_name": { KeyHead = "Имя региона"; break; }
        case "address": { KeyHead = "Адрес"; break; }
        case "telefon": { KeyHead = "Телефоны"; break; }
    }
    return KeyHead;
}
export function get_KeyHead_PL(key) {
    let KeyHead = '';
    switch (key) {
        case "id": { KeyHead = "id"; break; }
        case "nm": { KeyHead = "Название"; break; }
        case "name": { KeyHead = "Вид топлива"; break; }
        case "V": { KeyHead = "Объем, л"; break; }
        case "MaxV": { KeyHead = "Максимальный объём, л"; break; }
        case "Vq": { KeyHead = "Объём для заказа, л"; break; }
        case "minV": { KeyHead = "Минимальный объём, л"; break; }
        case "maxVM": { KeyHead = "Максимальный объём подтоварной воды, л"; break; }

    }
    return KeyHead;
}


export function compare_azs_iid(a, b) {
    if (a.iid > b.iid) return 1;
    if (a.iid < b.iid) return -1;
}

export function get_Line_AZS(_Item) {

    if (_Item != null) {
        return "Индекс - " + _Item.iid +
            ", Название объекта - " + _Item.dispname +
            ", TH код объекта - " + _Item.th_code +
            ", Номер объекта - " + _Item.order_num +
            ", Название - " + _Item.shortname +
            ", Код регион - " + _Item.region_code +
            ", Имя региона - " + _Item.region_name +
            ", Адрес - " + _Item.address +
            ", Телефоны - " + _Item.telefon;
    } else {
        return "АЗС не выбрано.  ";
    }
}
export function get_Line_PL(_Item) {

    if (_Item != null) {
        //return "Индекс - " + _Item.img +
        return "Название - " + _Item.nm +
            ", Вид топлива - " + _Item.name +
            ", Объем, л - " + _Item.V +
            ", Максимальный объём, л - " + _Item.MaxV +
            ", Объём для заказа, л - " + _Item.Vq +
            ", Минимальный объём, л - " + _Item.minV +
            ", Максимальный объём подтоварной воды, л - " + _Item.maxVM;
    } else {
        return "Резервуар";
    }
}

export function get_Line_PUMP(_Item) {

    if (_Item != null) {
        //return "Индекс - " + _Item.img +
        return "Название - " + _Item.nm;

    } else {
        return "ТРК";
    }
}
export function get_Line_TSO(_Item) {

    if (_Item != null) {
        //return "Индекс - " + _Item.img +
        return "Название - " + _Item.nm;

    } else {
        return "ТСО";
    }
}


/*
 
function get_Fuel_Code(data, data_val, azs) {
    let _fuel = 0;
    let mass_DVC_AZS = null;
    for (const dvc of azs) {
        if (data.id == dvc.dvc_id) {
            for (const _dvc of azs) {
                if (_dvc.ID == dvc.ID && _dvc.key == "id" && _dvc.mass_DVC != null) {
                    mass_DVC_AZS = _dvc.mass_DVC;
                    break;
                }
            }
        }
        if (data.id == dvc.dvc_id && dvc.key == data_val.typ && dvc.key == "nozzle" && mass_DVC_AZS != null) {
            for (const dev_A of mass_DVC_AZS) {
                if (dev_A.typ == data_val.typ) {
                    if (dev_A.prop != undefined) {
                        for (const item_prop of dev_A.prop) {
                            if (item_prop.typ == 'NUM') {
                                if (parseInt(item_prop.capacity) == parseInt(data_val.val)) {
                                    _fuel = dev_A.fuel;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return _fuel;
}
 
export function Data_Read(data, dvc, azs) {
    //let dvc = this.state.EL;
    let DATA = JSON.parse(data);
    for (const data_val of DATA.values) {
        if (DATA.id == dvc.dvc_id) {
            switch (data_val.typ) {
                case "STATE_PL": dvc.state_pl = data_val.val; break;
                case "WATER_LEVEL": dvc.water_level = data_val.val; break;
                case "STATE_SHIFT": dvc.state_shift = data_val.val; break;
                case "STATUS_TRK":
                    {
                        dvc.state_trk = data_val.val;
                        break;
                    }
                case "nozzle":
                    {
                        if (data_val.val != 0) {
                            let _fuel = get_Fuel_Code(DATA, data_val, azs);
                            dvc.fuel = _fuel;
                        } else {
                            dvc.fuel = 0;
                        }
                        break;
                    }case "TOTAL_OBSERVED_VOLUME": dvc.TOTAL_OBSERVED_VOLUME = data_val.val.toFixed(2); break;
                case "AVERAGE_TEMP": dvc.AVERAGE_TEMP = data_val.val.toFixed(2); break;
                case "TP_STATUS": dvc.TP_STATUS = data_val.val; break;
                case "cn08": dvc.cn08 = data_val.val; break;
                case "OBSERVED_DENSITY": dvc.OBSERVED_DENSITY = data_val.val; break;
                case "TOTAL_GROSS_STANDARD_VOLUME": dvc.TOTAL_GROSS_STANDARD_VOLUME = data_val.val; break;
 
                case "PRODUCT_LEVEL": dvc.PRODUCT_LEVEL = data_val.val.toFixed(2); break;
                case "WATER_VOLUME": dvc.WATER_VOLUME = data_val.val.toFixed(2); break;
 
 
 
 
            }
 
             for (const _key in dvc) {
                //if (dvc.key == data_val.typ) {
                if (_key.toLowerCase() == data_val.typ.toLowerCase()) {
                    if (data_val.comment != null) {
                        dvc[_key] = data_val.comment;
                    } else {
                        dvc[_key] = data_val.val.toFixed(2);
                    }
                    dvc.crit = data_val.crit;
                    break;
                }
            }
        }
    }
    return dvc;
}
*/

export function Init_DVC() {
    let DVC = new Array();

    DVC.push({ nm: "Резервуар", typ: "pl", check: true, id: createGuid(), img: "./images/pl.png" });

    DVC.push({ nm: "ТРК", typ: "pump", check: true, id: createGuid(), img: "./images/TRK.png" });

    DVC.push({ nm: "ТСО", typ: "tso", check: true, id: createGuid(), img: "./images/TSO.png" });

    //DVC.push({ nm: "CAM", typ: "cam", check: true, id: createGuid() });
    return DVC;
}