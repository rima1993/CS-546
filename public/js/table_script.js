function edit_row(no)
{
    document.getElementById("edit_button"+no).style.display="none";
    document.getElementById("save_button"+no).style.display="inline";

    var name=document.getElementById("name"+no);
    var description=document.getElementById("description"+no);
    var unitCost=document.getElementById("unitCost"+no);
    var inStock=document.getElementById("inStock"+no);
    var discount=document.getElementById("discount"+no);
    var discountQty=document.getElementById("discountQty"+no);

    var name_data=name.innerHTML;
    var description_data=description.innerHTML;
    var unitCost_data=unitCost.innerHTML;
    var inStock_data=inStock.innerHTML;
    var discount_data=discount.innerHTML;
    var discountQty_data=discountQty.innerHTML;

    name.innerHTML="<label id='name_text"+no+"'>"+name_data+"</label>";
    description.innerHTML="<input type='text' id='description_text"+no+"' value='"+description_data+"'>";
    unitCost.innerHTML="<input type='number' id='unitCost_text"+no+"' value='"+unitCost_data+"'>";
    inStock.innerHTML="<input type='number' id='inStock_text"+no+"' value='"+inStock_data+"'>";
    discount.innerHTML="<input type='number' id='discount_text"+no+"' value='"+discount_data+"'>";
    discountQty.innerHTML="<input type='number' id='discountQty_text"+no+"' value='"+discountQty_data+"'>";
}

function save_row(no)
{
    var name_val=document.getElementById("name_text"+no).textContent;
    var description_val=document.getElementById("description_text"+no).value;
    var unitCost_val=document.getElementById("unitCost_text"+no).value;
    var inStock_val=document.getElementById("inStock_text"+no).value;
    var discount_val=document.getElementById("discount_text"+no).value;
    var discountQty_val=document.getElementById("discountQty_text"+no).value;
    var result = name_val+'\n'+description_val+'\n'+unitCost_val+'\n'+inStock_val+ '\n'+discount_val+ '\n'+discountQty_val;
    console.log(result);
    var re= /^\w*([\. -.]*w+)*$/;
    var re1 = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.\/? ]*$/;
    if (typeof description_val != "string" || description_val.length <= 0 || !description_val.match(re1))
    {
        show_err("No Valid Description while updating");

    }
    else if (parseFloat(unitCost_val) <=0  || parseFloat(unitCost_val) > 999999)
    {
        show_err("No Valid UnitCost while updating");
    }
    else if (parseFloat(inStock_val) <=0  || parseFloat(inStock_val) > 99999)
    {
        show_err("No Valid InStock while updating");
    }
    else if (parseFloat(discount_val) <0  || parseFloat(discount_val) > 100)
    {
        show_err("No Valid Discount while updating");
    }
    else if(parseFloat(discountQty_val) <0  || parseFloat(discountQty_val) > 999999)
    {
        show_err("No Valid Discount Quantity while updating");
    }
    else {
        var objc = {
            name: name_val,
            description: description_val,
            unitCost: unitCost_val,
            inStock: inStock_val,
            discount: discount_val,
            discountQty: discountQty_val
        };
        jQuery.ajax({
            url: "/vendor/updateMaterial",
            data: objc,
            dataType: "json",
            type: "POST"
        }).fail(function (data) {
            if (data.responseText != "done") {
                show_err(data.responseText);
            }
            else
            {
                var name_val = document.getElementById("name_text" + no).value;
                var description_val = document.getElementById("description_text" + no).value;
                var unitCost_val = document.getElementById("unitCost_text" + no).value;
                var inStock_val = document.getElementById("inStock_text" + no).value;
                var discount_val = document.getElementById("discount_text" + no).value;
                var discountQty_val = document.getElementById("discountQty_text" + no).value;

                document.getElementById("description" + no).innerHTML = description_val;
                document.getElementById("unitCost" + no).innerHTML = unitCost_val;
                document.getElementById("inStock" + no).innerHTML = inStock_val;
                document.getElementById("discount" + no).innerHTML = discount_val;
                document.getElementById("discountQty" + no).innerHTML = discountQty_val;

                document.getElementById("edit_button" + no).style.display = "inline";
                document.getElementById("save_button" + no).style.display = "none";
                document.getElementById("comment-box").innerHTML = "";
            }
        });
    }
}
function delete_row(no)
{
    var name_val=document.getElementById("name"+no).textContent;
    var objc = {  name:name_val };
    jQuery.ajax({
    url: "/vendor/deleteMaterial",
    data: objc,
    dataType: "json",
    type: "POST"});
    document.getElementById("row"+no+"").outerHTML="";
}
function add_row()
{
    var name=document.getElementById("name").value;
    var description=document.getElementById("description").value;
    var unitCost=document.getElementById("unitCost").value;
    var inStock=document.getElementById("inStock").value;
    var discount=document.getElementById("discount").value;
    var discountQty=document.getElementById("discountQty").value;
    console.log(typeof discount );
    var re= /^[a-zA-Z0-9 ]*$/;
    var re1 = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.\/? ]*$/;
    if (typeof name != "string" || name.length <= 0 || !name.match(re))
    {
        show_err("No Valid Name");
    }
    else if (typeof description != "string" || description.length <= 0 || !description.match(re1))
    {
        show_err("No Valid Description");
    }
    else if (parseFloat(unitCost) <=0  || parseFloat(unitCost) > 999999)
    {
        show_err("No Valid UnitCost");
    }
    else if (parseFloat(inStock) <=0  || parseFloat(inStock) > 99999)
    {
        show_err("No Valid InStock");
    }
    else if (parseFloat(discount) <0  || parseFloat(discount) > 100)
    {
        show_err("No Valid Discount");
    }
    else if(parseFloat(discountQty) <0  || parseFloat(discountQty) > 999999)
    {
        show_err("No Valid Discount Quantity");
    }
    else {
        console.log("here");
        var result = name + '\n' + description + '\n' + unitCost + '\n' + inStock + '\n' + discount + '\n' + discountQty;
        console.log(result);
        var objc = {
            name: name,
            description: description,
            unitCost: unitCost,
            inStock: inStock,
            discount: discount,
            discountQty: discountQty
        };
        jQuery.ajax({
            url: "/vendor/addMaterial",
            data: objc,
            dataType: "json",
            type: "POST"
        }).fail(function (data) {
            if (data.responseText != "done") {
                show_err(data.responseText);
            }
            else
            {
                add_new_row();
            }
        });
    }
}
function add_new_row()
{
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var unitCost = document.getElementById("unitCost").value;
    var inStock = document.getElementById("inStock").value;
    var discount = document.getElementById("discount").value;
    var discountQty = document.getElementById("discountQty").value;

    var table=document.getElementById("data_table");
    var table_len_row = (table.rows.length)-1;
    var table_len=(table.rows.length)-2;
    var row = table.insertRow(table_len_row).outerHTML="<tr id='row"+table_len+"'><td id='name"+table_len+"'>"+name+"</td><td id='description"+table_len+"'>"+description+"</td><td id='unitCost"+table_len+"'>"+unitCost+"</td><td id='inStock"+table_len+"'>"+inStock+"</td><td id='discount"+table_len+"'>"+discount+"</td><td id='discountQty"+table_len+"'>"+discountQty+"</td><td><input type='button' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr>";
    document.getElementById("save_button"+table_len).style.display="none";
    var updatedRow = table.rows[table_len].cells[6];
    console.log(updatedRow);
    document.getElementById("name").value="";
    document.getElementById("description").value="";
    document.getElementById("unitCost").value="";
    document.getElementById("inStock").value="";
    document.getElementById("discount").value="";
    document.getElementById("discountQty").value="";
    document.getElementById("comment-box").innerHTML = "";
}
function show_err(err)
{
    console.log('here '+err);
    document.getElementById("comment-box").innerHTML = err;
}



