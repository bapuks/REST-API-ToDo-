const uri = "api/todo";
let todos = null;
function getCount(data) {
    const el = $("#counter");
    let name = "to-do";
    if (data) {
        if (data > 1) {
            name = "to-dos";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

$(document).ready(function () {
    getData();
});

// jQuery sends an HTTP GET request to the web API, which returns JSON representing an array of to-do items.
// The success callback function is invoked if the request succeeds.
function getData() {    
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#todos");

            $(tBody).empty();

            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append(
                        $("<td></td>").append(
                            $("<input/>", {
                                type: "checkbox",
                                disabled: true,
                                checked: item.isComplete
                            })
                        )
                )
                    .append($("<td></td>").text(item.percentComplete))
                    .append($("<td></td>").text(item.title))
                    .append($("<td></td>").text(item.name))
                    .append(
                        $("<td></td>").append(
                            $("<button>Edit</button>").on("click", function () {
                                editItem(item.id);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>Delete</button>").on("click", function () {
                                deleteItem(item.id);
                            })
                        )
                    )                    
                    ;

                tr.appendTo(tBody);
            });

            todos = data;
        }
    });
}


// jQuery sends an HTTP POST request with the to -do item in the request body.The accepts and contentType options are set to application / json to specify the media type being received and sent.
// The to-do item is converted to JSON by using JSON.stringify.
// When the API returns a successful status code, the getData function is invoked to update the HTML table.
function addItem() {

    const item = {
        name: $("#add-name").val(),
        isComplete: false
    };

    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
        }
    });
}

// Deleting a to-do item is accomplished by setting the type on the AJAX call to DELETE and specifying the item's unique identifier in the URL.
function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {            
            $("#edit-id").val(item.id);
            $("#edit-isComplete")[0].checked = item.isComplete;   
            $("#edit-percent-complete").val(item.percentComplete);   
            $("#edit-title").val(item.title);
            $("#edit-name").val(item.name);
        }
    });
    $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        percentComplete: $("#edit-percent-complete").val(),
        title: $("#edit-title").val(),
        name: $("#edit-name").val(),
        isComplete: $("#edit-isComplete").is(":checked"),        
        id: $("#edit-id").val()
    };

    //Updating a to-do item is similar to adding one.
    //The url changes to add the unique identifier of the item, and the type is PUT
    $.ajax({
        url: uri + "/" + $("#edit-id").val(),
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $("#spoiler").css({ display: "none" });
}