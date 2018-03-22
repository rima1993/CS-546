var vendorData;
function edit_row(no) {
    document.getElementById("edit_button" + no).style.display = "none";
    document.getElementById("save_button" + no).style.display = "inline";

    var mName = document.getElementById("mName" + no);
    var qty = document.getElementById("qty" + no);
    var vValue = document.getElementById("vValue" + no);

    var unitcost = document.getElementById("unitcost" + no);
    var details = document.getElementById("details" + no);
    var price = document.getElementById("price" + no);

    var mName_data = mName.innerHTML;
    var qty_data = qty.innerHTML;
    var vValue_data = vValue.innerHTML;
    var unitcost_data = unitcost.innerHTML;
    var details_data = details.innerHTML;
    var price_data = price.innerHTML;

    mName.innerHTML = "<input type='text' id='mName_text" + no + "' value='" + mName_data + "' disabled>";
    qty.innerHTML = "<input type='number' id='qty_text" + no + "' value='" + qty_data + "'>";
    vValue.innerHTML = "<select id='vValue_text" + no + "' onchange='vEditChange(" + no + ")' value='" + vValue_data + "'><option value='0' id='vName'>Other Vendor</option></select>";
    unitcost.innerHTML = "<input type='number' onchange='editotherUnit(" + no + ")' id='unitcost_text" + no + "' value='" + unitcost_data + "'>";
    price.innerHTML = "<label id='price_text" + no + "' value='" + price_data + "'>" + price_data + "</label>";
    details.innerHTML = "<a href='' id='details_text" + no + "' value='" + details_data + "'>";

    var e = document.getElementById("vValue_text" + no);
    if (e.length > 1) {
        editpriceCal(n);
    }
    else {
        var mName = document.getElementById("mName_text" + no).value;
        var qty = document.getElementById("qty_text" + no).value;

        var objc = {
            mName: mName,
            qty: qty
        };

        jQuery.ajax({
            url: "/estimator/getVendor",
            data: objc,
            dataType: "json",
            type: "POST"
        }).done(function (data) {
            vendorData = data;
            if (data.length > 0) {
                addEdit_Vendor(data, no, vValue_data);
            }
            else {
                document.getElementById("unitcost_text" + no).disabled = false;
            }
        });
    }

    totalCost();
}

function editotherUnit(n) {
    var e = document.getElementById("vValue_text" + n);
    var val = e.options[e.selectedIndex].value;

    if (val == 0) {
        var q = parseFloat(document.getElementById("qty_text" + n).value) * parseFloat(document.getElementById("unitcost_text" + n).value);
        document.getElementById("price_text" + n).textContent = q;
    }
    else {
        var txt = e.options[e.selectedIndex].text;
        var dis;
        var disQtyl;


        for (var i = 0; i < vendorData.length; i++) {
            if (vendorData[i].userName == txt) {
                dis = vendorData[i].discount;
                disQtyl = vendorData[i].discountQty;
                break;
            }
        }
        if (parseFloat(document.getElementById("qty_text" + n).value) >= disQtyl) {
            var q = parseFloat(document.getElementById("qty_text" + n).value)
                * parseFloat(document.getElementById("unitcost_text" + n).value) *
                (100 - parseFloat(dis));
            document.getElementById("price_text" + n).textContent = q;
        }
        else {
            var q = parseFloat(document.getElementById("qty_text" + n).value) * parseFloat(document.getElementById("unitcost_text" + n).value);
            document.getElementById("price_text" + n).textContent = q;
        }
    }
    totalCost();
}

function vEditChange(n) {
    var e = document.getElementById("vValue_text" + n);
    var val = e.options[e.selectedIndex].value;

    document.getElementById("unitcost_text" + n).value = val;
    if (val > 0) {
        document.getElementById("unitcost_text" + n).disabled = true;
    }
    else {
        document.getElementById("unitcost_text" + n).disabled = false;
    }

    editpriceCal(n);
    totalCost();

}

function editpriceCal(n) {
    console.log(2);
    var e = document.getElementById("vValue_text" + n);
    var val = e.options[e.selectedIndex].value;
    var txt = e.options[e.selectedIndex].text;
    var dis;
    var disQtyl;


    for (var i = 0; i < vendorData.length; i++) {
        if (vendorData[i].userName == txt) {
            dis = vendorData[i].discount;
            disQtyl = vendorData[i].discountQty;
            break;
        }
    }
    if (parseFloat(document.getElementById("qty_text" + n).value) >= disQtyl) {
        console.log(dis + " " + disQtyl);
        var q = parseFloat(document.getElementById("qty_text" + n).value)
            * parseFloat(val) *
            (100 - parseFloat(dis)) / 100;
        console.log(q);
        document.getElementById("price_text" + n).textContent = q;
    }
    else {
        console.log(4);
        var q = parseFloat(document.getElementById("qty_text" + n).value) * parseFloat(val);
        document.getElementById("price_text" + n).textContent = q;
    }
    if (txt == "Other Vendor") {
        var q = parseFloat(document.getElementById("qty_text" + n).value) *
            parseFloat(document.getElementById("unitcost_text" + n).value)
        document.getElementById("price_text" + n).textContent = q;
    }

    totalCost();
}

function addEdit_Vendor(vendor_lst, no, vValue_data) {

    var vlist = {};
    for (var i = 0; i < vendor_lst.length; i++) {
        vlist[vendor_lst[i].userName] = vendor_lst[i].unitCost;
    }
    $.each(vlist, function (val, text) {
        $('#vValue_text' + no).append($('<option></option>').val(text).html(val))
    });

    var selectObj = document.getElementById("vValue_text" + no);

    for (var i = 0; i < selectObj.length; i++) {

        if (selectObj[i].text == vValue_data) {
            selectObj[i].selected = true;
            editpriceCal(no);
            if (vValue_data != "Other Vendor") {
                document.getElementById("unitcost_text" + no).disabled = true;
            }
            break;
        }
    }
    totalCost();
}


function save_row(no) {
    var mName_val = document.getElementById("mName_text" + no).value;
    var qty_val = document.getElementById("qty_text" + no).value;
    var e = document.getElementById("vValue_text" + no);
    var vValue_val = e.options[e.selectedIndex].text;
    var unitcost_val = document.getElementById("unitcost_text" + no).value;
    var details_val = document.getElementById("details_text" + no).value;
    var price_val = document.getElementById("price_text" + no).value;
    var pName = document.getElementById("pName").value;
    var result = mName_val + '\n' + qty_val + '\n' + vValue_val + '\n' + unitcost_val + '\n' + details_val + '\n' + price_val;
    if (parseFloat(qty) <=0  || parseFloat(qty) > 999999)
    {
        show_err("No Valid quatity while updating");
    }
    else
        {
    var objc = {
        mName: mName_val,
        qty: qty_val,
        unitCost: unitcost_val,
        vName: vValue_val,
        pName: pName
    };


    jQuery.ajax({
        url: "/estimator/editMaterial",
        data: objc,
        dataType: "json",
        type: "POST"
    }).
        fail(function (data) {
            if (data.responseText != "done") {
                show_err(data.responseText);
            }
            else {
                var mName_val = document.getElementById("mName_text" + no).value;
                var qty_val = document.getElementById("qty_text" + no).value;
                var e = document.getElementById("vValue_text" + no);
                var vValue_val = e.options[e.selectedIndex].text;
                var unitcost_val = document.getElementById("unitcost_text" + no).value;
                var details_val = document.getElementById("details_text" + no).value;
                var price_val = document.getElementById("price_text" + no).textContent;
                var pName = document.getElementById("pName").value;

                //var total = parseFloat(qty_val)*parseFloat(unitcost_val);
                document.getElementById("mName" + no).innerHTML = mName_val;
                document.getElementById("qty" + no).innerHTML = qty_val;
                document.getElementById("vValue" + no).innerHTML = vValue_val;
                document.getElementById("unitcost" + no).innerHTML = unitcost_val;
                document.getElementById("details" + no).innerHTML = details_val;
                document.getElementById("price" + no).innerHTML = price_val;

                document.getElementById("edit_button" + no).style.display = "inline";
                document.getElementById("save_button" + no).style.display = "none";
                totalCost();

            }
        });}

    totalCost();
}

function delete_row(no) {
    var mName = document.getElementById("mName" + no).textContent;
    var pName = document.getElementById("pName").value;
    var vName = document.getElementById("vValue" + no).textContent;

    var objc = {
        pName: pName,
        mName: mName,
        vName: vName
    };

    jQuery.ajax({
        url: "/estimator/deleteMaterial",
        data: objc,
        dataType: "json",
        type: "POST"
    });

    document.getElementById("row" + no + "").outerHTML = "";
    totalCost();
}

function add_row() {
    var mName = document.getElementById("mName").value;
    var qty = document.getElementById("qty").value;
    var e = document.getElementById("vValue");
    var vValue = e.options[e.selectedIndex].text;
    var unitcost = document.getElementById("unitcost").value;
    var price = document.getElementById("price").textContent;
    var pName = document.getElementById("pName").value;

    var re = /^[a-zA-Z0-9 ]*$/;
    var re1 = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.\/? ]*$/;
    if (typeof mName != "string" || mName.length <= 0 || !mName.match(re)) {
        show_err("No Valid Material");
    }
    else if (parseFloat(qty) <= 0 || parseFloat(qty) > 999999 || qty.length <= 0) {
        show_err("No Valid quatity");
    }
    else if (parseFloat(unitcost) <= 0 || parseFloat(unitcost) > 99999) {
        show_err("No Valid Unit Cost");
    }
    else {


        var objc = {
            mName: mName,
            qty: qty,
            unitcost: unitcost,
            vValue: vValue,
            pName: pName
        };

        jQuery.ajax({
            url: "/estimator/addMaterial",
            data: objc,
            dataType: "json",
            type: "POST"
        }).
            fail(function (data) {
                if (data.responseText != "done") {
                    show_err(data.responseText);
                }
                else {
                    var mName = document.getElementById("mName").value;
                    var qty = document.getElementById("qty").value;
                    var e = document.getElementById("vValue");
                    var vValue = e.options[e.selectedIndex].text;
                    var unitcost = document.getElementById("unitcost").value;
                    var price = document.getElementById("price").textContent;
                    var pName = document.getElementById("pName").value;

                    var table = document.getElementById("data_table_e");
                    var table_len_row = (table.rows.length) - 1;
                    var table_len = (table.rows.length) - 2;

                    var row = table.insertRow(table_len_row).outerHTML = "<tr id='row" + table_len + "'><td id='mName" + table_len + "'>" + mName + "</td><td id='qty" + table_len + "' onchange=\"editpriceCal(" + table_len + ")\">" + qty + "</td><td id='vValue" + table_len + "'>" + vValue + "</td><td id='unitcost" + table_len + "'>" + unitcost + "</td><td id='price" + table_len + "'>" + price + "</td><td><input class='e_details' type='button' id='details" + table_len + "' value='Details' onclick='detalis(" + table_len + ")'></td><td><input type='button' id='edit_button" + table_len + "' value='Edit' class='edit' onclick='edit_row(" + table_len + ")'> <input type='button' id='save_button" + table_len + "' value='Save' class='save' onclick='save_row(" + table_len + ")'> <input type='button' value='Delete' class='delete' onclick='delete_row(" + table_len + ")'></td></tr>";
                    document.getElementById("save_button" + table_len).style.display = "none";
                    var updatedRow = table.rows[table_len].cells[6];
                    document.getElementById("mName").value = "";
                    document.getElementById("qty").value = "";
                    //document.getElementById("vValue").value="";
                    $('#vValue').empty()
                    var select = document.getElementById("vValue");
                    var option = document.createElement('option');
                    option.text = 'Other Vendor';
                    option.value = 0;
                    select.add(option, 0);
                    document.getElementById("unitcost").value = "";
                    document.getElementById("price").textContent = "0";
                    document.getElementById("comment-box").innerHTML = "";
                    totalCost();
                }
            });
    } totalCost();

}

function detalis(n) {
    var mName = document.getElementById("mName" + n).textContent;
    var qty = document.getElementById("qty" + n).textContent;
    var vValue = document.getElementById("vValue" + n).textContent;
    var pName = document.getElementById("pName").value;

    var objc = {
        mName: mName,
        vValue: vValue,
        pName: pName,
        qty: qty
    };

    jQuery.ajax({
        url: "/estimator/getDetails",
        data: objc,
        dataType: "json",
        type: "POST"
    }).done(function (data) {
        var total;
        if (data.qty >= data.discountQty) {
            total = parseFloat(data.unitCost) * parseFloat(data.qty) * (100 - parseFloat(data.discount)) / 100;
        }
        else {
            total = parseFloat(data.unitCost) * parseFloat(data.qty);
        }
        alert("Material Name: \t\t" + data.mName + "\n" +
            "Material Description: \t" + data.description + "\n" +
            "Vendor Name: \t\t" + data.vName + "\n" +
            "Unit Cost: \t\t\t$" + data.unitCost + "\n" +
            "Quantity: \t\t\t" + data.qty + "\n" +
            "Discount: \t\t\t" + data.discount + "%\n" +
            "Discount on Qty: \t\t" + data.discountQty + "\n" +
            "Total Price: \t\t\t$" + total
        );
    });
    totalCost();
}



function vValue() {
    var e = document.getElementById("vValue");
    if (e.length > 1) {
        priceCal();
    }
    else {
        var mName = document.getElementById("mName").value;
        var qty = document.getElementById("qty").value;

        var objc = {
            mName: mName,
            qty: qty
        };

        jQuery.ajax({
            url: "/estimator/getVendor",
            data: objc,
            dataType: "json",
            type: "POST"
        }).done(function (data) {
            vendorData = data;
            if (data.length > 0) {
                add_Vendor(data);
            }
            else {
                document.getElementById("unitcost").disabled = false;
            }
        }).
            fail(function (data) {
                if (data.length > 0) {
                    add_Vendor(data);
                }
                else {
                    document.getElementById("unitcost").disabled = false;
                }
            });
    }
    totalCost();
}

function add_Vendor(vendor_lst) {

    var vlist = {};
    for (var i = 0; i < vendor_lst.length; i++) {
        vlist[vendor_lst[i].userName] = vendor_lst[i].unitCost;
    }
    $.each(vlist, function (val, text) {
        $('#vValue').append($('<option></option>').val(text).html(val))
    });

}

function vChange() {
    var e = document.getElementById("vValue");
    var val = e.options[e.selectedIndex].value;

    document.getElementById("unitcost").value = val;
    if (val > 0) {
        document.getElementById("unitcost").disabled = true;
    }
    else {
        document.getElementById("unitcost").disabled = false;
    }

    priceCal();
    totalCost();

}

function priceCal() {
    var e = document.getElementById("vValue");
    var val = e.options[e.selectedIndex].value;
    var txt = e.options[e.selectedIndex].text;
    var dis;
    var disQtyl;


    for (var i = 0; i < vendorData.length; i++) {
        if (vendorData[i].userName == txt) {
            dis = vendorData[i].discount;
            disQtyl = vendorData[i].discountQty;
            break;
        }
    }

    var q;
    if (parseFloat(document.getElementById("qty").value) >= disQtyl) {
        q = parseFloat(document.getElementById("qty").value) * parseFloat(val) * (100 - parseFloat(dis)) / parseFloat(100);
    }
    else {
        q = parseFloat(document.getElementById("qty").value) * parseFloat(val);
    }

    document.getElementById("price").textContent = q;
    totalCost();
}

function otherUnit() {
    var e = document.getElementById("vValue");
    var val = e.options[e.selectedIndex].value;
    if (val == 0) {
        var q = parseFloat(document.getElementById("qty").value) * parseFloat(document.getElementById("unitcost").value);
        document.getElementById("price").textContent = q;
    }
    totalCost();
}

function totalCost() {

    var table = document.getElementById("data_table_e");
    var total = 0;
    for (var i = 1, row; row = table.rows[i]; i++) {
        total = total + parseFloat(row.cells[4].textContent);
    }

    document.getElementById("total-cost").innerHTML = total;
}

function show_err(err) {
    document.getElementById("comment-box").innerHTML = err;
}

window.onload = function () {
    totalCost();
};

