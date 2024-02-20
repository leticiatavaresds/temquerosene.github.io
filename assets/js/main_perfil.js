var indexLinha = 0;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var optSelcd = "";

var username = '{{ data.username }}';
var site = '{{ data.site }}';
console.log("username");
console.log(username);


today = yyyy + '-' + mm + '-' + dd;


$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
        boundary: "window",
        container: "body"
    }); 
  var actions = `<a class="add" title="Confirm" data-toggle="tooltip"><i class="fa fa-check"></i></a>
                 <a class="edit" title="Edit" data-toggle="tooltip"><i class="fas fa-edit"></i></a>
                 <a class="delete" title="Delete" data-toggle="tooltip"><i class="fa fa-trash"></i></a>`;
  var dataTable = $('#dtBasic').DataTable({
    // dom: 'lfrtBip',
    // "paging": true, // false to disable pagination (or any other option)
    // "scrollY": "300px",
    "scrollCollapse": true,
    stateSave: true,
    buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
    ]
  });
  dataTable.draw();
  
  $('.table-add').click(function() {

    optSelcd = "ADD";

    $(this).attr("disabled", "disabled");
    var row = '<tr class="hide">'+
    `<td style = "width: 15%;">
        <select class="form-control" name="nome" id="nome">
            <option value="Marina">Marina</option>
            <option value="Letícia">Letícia</option>
            <option value="Nina">Nina</option>
        </select>
    </td>` + 
    '<td style = "width: 25%;"><input type="text" class="form-control" name="descricao" id="descricao"></td>' +
    `<td style = "width: 15%;">
        <select class="form-control" name="categoria" id="categoria">
            <option value="Roupa">Roupa</option>
            <option value="Cenário">Cenário</option>
            <option value="Marketing">Marketing</option>
        </select>
    </td>` +
    `<td style = "width: 15%;">
        <input type="date" id="data" name="data" value="` + today + `" min="2024-01-01" max="2024-01-31" />
    </td>` +
    '<td style = "width: 15%;"><input type="number" step="0.01" class="form-control" name="valor" id="valor"></td>' +
    '<td style = "width: 15%;">' + actions + '</td>' +
    '</tr>';

    current = dataTable.order();
    dataTable.order([]);

    newRowIndex = dataTable.row.add($(row));
    indexRow = newRowIndex.index();
    newRowIndex.draw();

    console.log("indexRowADD: " + indexRow);


    $("table tbody tr").eq(indexRow).find(".add, .edit").toggle();
    indexLinha += 1;

    dataTable.order(current).draw();


    $('[data-toggle="tooltip"]').tooltip({
        boundary: "window",
        container: "body"
    });;


  });
  
    // Add row on add button click
    $(document).on("click", ".add", function(){
        

        var empty = false;
        var input = $(this).parents("tr").find('input');
        const values = [];

        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });

        $(this).parents("tr").find(".error").first().focus();

        if(!empty){
            input.each(function(){

                value = $(this).val();
                $(this).parent("td").html(value);

                values.push(value);
            });
            

            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }

        var select = $(this).parents("tr").find('select');

        select.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });

        $(this).parents("tr").find(".error").first().focus();

        if(!empty){
            
            select.each(function(){

                value = $(this).find(":selected").text();

                values.push(value);

                $(this).parent("td").html(value);
            });
        }


        // Remove input-box row and put value row
        $(this).tooltip('hide');
        var lastHTML = '<tr>' + $(this).parents("tr").html() + '</tr>';

        current = dataTable.order();

        indexRow = dataTable.row($(this).parents("tr")).index();

        dataTable.row($(this).parents("tr")).remove();
        dataTable.row.add($(lastHTML)).draw();

        var dataRow = {"nome": values[3],
        "descricao": values[0],
        "categoria": values[4],
        "data": values[1],
        "valor": values[2],
        "indexRow": indexRow,
        "order": current,
        "optSelcd": optSelcd};


        $.post( "/edit_table", {
            dataRow
        });


    });

    // Edit row on edit button click
    $(document).on("click", ".edit", function(){

        optSelcd = "EDIT";

        var i = 0;
        var newHtml = "";
        var value = "";

        var table = $('#dtBasic').DataTable();
        var users = '{{users}}';
        

        $(this).parents("tr").find("td:not(:last-child)").each(function(){


            if ( i == 0){

                newHtml = '<select class="form-control" name="nome" id="nome">';

                const options = ["Marina", "Letícia", "Nina"];
                console.log('USERS:')
                console.log(users)

                value = $(this).text();

                for (opt in options){                    
                    newHtml = newHtml + '<option value="' + options[opt] + '"';

                    if(options[opt] == value){
                        newHtml = newHtml + ' selected';
                    }

                    newHtml = newHtml + '>' + options[opt] + '</option>';
                }

                

            }else if (i == 1){
                newHtml = '<input type="text" class="form-control" name="descricao" id="descricao" value="' + $(this).text() + '">';

            }
            else if (i == 2){

                newHtml = '<select class="form-control" name="categoria" id="categoria">';

                const options = ["Roupa", "Cenário", "Marketing"];

                value = $(this).text();

                for (opt in options){                    
                    newHtml = newHtml + '<option value="' + options[opt] + '"';

                    if(options[opt] == value){
                        newHtml = newHtml + ' selected';
                    }

                    newHtml = newHtml + '>' + options[opt] + '</option>';
                }

            }
            else if (i == 3){
                newHtml = '<input type="date" id="data" name="data" min="2024-01-01" max="2024-01-31" value="' + $(this).text() + '">';

            }
            else if (i == 4){
                newHtml = '<input type="number" step="0.01" class="form-control" name="valor" id="valor" value="' + $(this).text() + '">';

            }

            console.log("HELLOO");

            console.log(newHtml);
            console.log(i);

            i = i + 1;

            $(this).html(newHtml);

        });		
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
    });

    // Delete row on delete button click
    $(document).on("click", ".delete", function(){
        $(this).tooltip('hide');
        dataTable.row($(this).parents("tr")).remove().draw();
        $(".add-new").removeAttr("disabled");
        indexLinha -= 1;
    });

});
 
