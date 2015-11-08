
var Table = (function(){
    "use strict";
    /***
     *
     * @param {Array[]} data ordered data to pump into table body
     * @param {Object} metadata object containing metadata of table
     * @param {String[]} metadata.cols cols of table
     * @param {String} metadata.id table id
     * @param {String[]} [metadata.tableClass] class used in html
     * @param {String[]} [header] string to be used as Header in table, if not stated then table will not have Header
     * @param {String[]} [footer] string to be used as footer, to have empty footer, simply use an empty element in array
     * eg. ["", "halo", ""] will have 3 elements in footer, 2 of them being empty
     */
    function createFlexTable(body, metadata, header, footer){

       /*
        var tableClasses = (metadata.tableClass) ? metadata.tableClass + " flex-table" : "flex-table";

        var $tableContainer = $("<div></div>", {class: "flex-table-container"});
        var $table = $("<table></table>", {class: tableClasses, id: metadata.id});
        var $body = createFlexTableTopGroup(body, metadata.cols, "body");

        if (header) {
            var $header = createFlexTableTopGroup([header], metadata.cols, "header");
            $header.appendTo($table);
        }

        $body.appendTo($table);

        if (footer) {
            var $footer = createFlexTableTopGroup([footer], metadata.cols, "footer");
            $footer.appendTo($table);
        }

        $table.appendTo($tableContainer);

        return $tableContainer;
        */

        var $tableClasses = $("<div></div>",{class : "flex-table",id: metadata.id});//(metadata.tableClass) ? metadata.tableClass + " flex-table" : "flex-table";

        var $tableContainer = $("<div></div>",{class : "flex-table-container"});

        var $tableRowClass = $("<div></div>",{class : "Table-row Table-header"});

       // var $tableHeaders = $("<div></div>", {class: "Table-header"});

        //create table headers

         for(var i=0;i<header.length; i++){

            if(i=== 0)
            {
                $("<div></div>", {class: "Table-row-item u-Flex-grow2",text:header[i]}).appendTo($tableRowClass);

            }
            else if(i== 3){
                $("<div></div>", {class: "Table-row-item u-Flex-grow3",text:header[i]} ).appendTo($tableRowClass);

            }
            else{
                $("<div></div>", {class : "Table-row-item ",text:header[i]} ).appendTo($tableRowClass);
            }
            
         }

         //$tableHeaders.appendTo($tableRowClass);

         $tableRowClass.appendTo($tableClasses);
         $tableClasses.appendTo($tableContainer);

         console.log("The table container is : ",$tableContainer);


         return $tableContainer;

    }

    /***
     *
     * @param {object[][]} data header strings
     * @param {String[]} metadata cols name
     * @param {"header"\"footer"|"body"} opt optional arg to specify which type of element to create, default to header
     */
    function createFlexTableTopGroup(data, metadata, opt){

        var $outer = function(){
            switch (opt) {
                case "body":
                    return $("<tbody></tbody>");
                case "footer":
                    return $("<tfoot></tfoot>");
                default :
                    return $("<thead></thead>");
            }
        }();

        for (var i = 0 ; i < data.length ; i++){
            var innerType = (opt === "body") ? "data" : "header";
            var $tr = createFlexTableRow(data[i], metadata, innerType);
            $tr.appendTo($outer);
        }

        return $outer;
    }

    /***
     *
     * @param {object[]} data
     * @param {String[]} metadata cols name
     * @param {"header"|"data"} opt optional, default to "header"
     */
    function createFlexTableRow(data, metadata, opt){

        console.log("The metadata lenght is : " , metadata["cols"].length);

        console.log("The headers are lenght are : " , metadata["head"].length);

        if (data.length !== metadata["cols"].length) {
            throw new Error("metadata and data does not match");
        }

        var isData = (opt === "data");

        /*
        var $tr = $("<tr></tr>", {class: "flex-tr"});
        for (var i = 0 ; i < data.length ; i++){
            var className = metadata[i].toLowerCase().replace(/\s/g, "-") + " flex-tr-child";
            var rowElement = (isData) ?
                $("<td></td>", {class: className, text: data[i]}) :
                $("<th></th>", {class: className, text: data[i]});
            rowElement.appendTo($tr);
        }
        */
        var $tr = $("<div></div>", {class: "Table-row"});
        for (var i = 0 ; i < data.length ; i++){
            var className = metadata["cols"][i].toLowerCase().replace(/\s/g, "-") + " Table-row-item";

            if(i === 0){
                className = className + " u-Flex-grow2";
            }
            else if(i===3){
                className = className + " u-Flex-grow3";
            }

            var rowElement = $("<div></div>", {class: className, text: data[i], 'data-header' :metadata["head"][i]})

            rowElement.appendTo($tr);
        }

        return $tr;
    }


    function clearTableBody(id){
        var tbody = document.querySelector("#" + id +">tbody");
        while (tbody.firstElementChild){
            tbody.removeChild(tbody.firstElementChild);
        }
    }

    /***
     *
     * @param {String} id table id
     * @param {Object[]} data array of data to be transform to row
     * @param {Function} rowGenerator takes in one arg, and convert it into row to be append to table body
     */
    function appendTableBody(id, data, rowGenerator){
        
        var tbody = document.querySelector("#" + id);
        console.log("the table id is" , id);
        console.log("the table body is" , tbody);
        console.log("the table data is" , data);
        var docFrag = document.createDocumentFragment();
        data.map(function(ele){
            var row = rowGenerator(ele);
            docFrag.appendChild(row);
        });

        tbody.appendChild(docFrag);
        /*
        var tbody = document.querySelector(id);
        var $data = data;
        var $state = rowGenerator;

        console.log("The table body is :", tbody);

        console.log("The table data is :" , $data);

        console.log("The Table data length is: ", data.length);
        console.log("The first rowGenerator is : ", rowGenerator);
        console.log("The rowGenerator is : ", $state);
        */
    }

    /***
     *
     * @param {String} id table id
     * @param {Object[]} data array of data to be transform to row
     * @param {Function} rowGenerator takes in one arg, and convert it into row to be append to table body
     */
    function overwriteTableBody(id, data, rowGenerator){
        clearTableBody(id);
        appendTableBody(id, data, rowGenerator);
    }

    return {
        createFlexTable: createFlexTable,
        createFlexTableRow: createFlexTableRow,
        overwriteTableBody: overwriteTableBody,
        clearTableBody: clearTableBody,
        appendTableBody: appendTableBody
    };
}());